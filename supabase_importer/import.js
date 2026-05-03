import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化 Supabase 客户端 (使用 Service Role 绕过 RLS)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 目标 Storage Bucket，所有公司与产品资源统一进入 assets bucket
const TARGET_BUCKET = 'assets';

const STORAGE_FOLDER_ALIASES = {
    company_docs: 'company_doc',
    company_docss: 'company_doc',
    product_docs: 'product_doc',
    product_docss: 'product_doc'
};

const ALLOWED_FOLDERS = new Set([
    'company_certifications',
    'company_customers',
    'company_images',
    'company_doc',
    'product_images',
    'product_certifications',
    'product_doc'
]);

function normalizeStorageFolderName(folder) {
    const normalizedFolder = STORAGE_FOLDER_ALIASES[folder] || folder;

    if (!ALLOWED_FOLDERS.has(normalizedFolder)) {
        throw new Error(`不支持的资源目录: ${folder}`);
    }

    return normalizedFolder;
}

function getLocalFolderCandidates(folder, normalizedFolder) {
    const candidates = [folder, normalizedFolder];

    if (normalizedFolder === 'company_doc') {
        candidates.push('company_docs');
    }

    if (normalizedFolder === 'product_doc') {
        candidates.push('product_docs');
    }

    return [...new Set(candidates)];
}

function resolveLocalAssetPath(localAssetsDir, folder, normalizedFolder, fileName) {
    const folderCandidates = getLocalFolderCandidates(folder, normalizedFolder);

    for (const candidateFolder of folderCandidates) {
        const candidatePath = path.join(__dirname, 'local_assets', localAssetsDir, candidateFolder, fileName);
        if (fs.existsSync(candidatePath)) {
            return candidatePath;
        }
    }

    return path.join(__dirname, 'local_assets', localAssetsDir, folder, fileName);
}

async function findOrCreateManufacturer(manufacturer) {
    const { data: existingManufacturer } = await supabase
        .from('manufacturers')
        .select('id')
        .eq('slug', manufacturer.slug)
        .maybeSingle();

    if (existingManufacturer) {
        const { error: updateError } = await supabase
            .from('manufacturers')
            .update({
                ...manufacturer,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingManufacturer.id);

        if (updateError) {
            throw updateError;
        }

        return existingManufacturer.id;
    }

    const { data: createdManufacturer, error: createError } = await supabase
        .from('manufacturers')
        .insert({
            ...manufacturer,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

    if (createError) {
        throw createError;
    }

    return createdManufacturer.id;
}

async function findOrCreateProduct(product, manufacturerId) {
    const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .eq('manufacturer_id', manufacturerId)
        .maybeSingle();

    if (existingProduct) {
        const { error: updateError } = await supabase
            .from('products')
            .update({
                ...product,
                manufacturer_id: manufacturerId,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingProduct.id);

        if (updateError) {
            throw updateError;
        }

        return existingProduct.id;
    }

    const { data: createdProduct, error: createError } = await supabase
        .from('products')
        .insert({
            ...product,
            manufacturer_id: manufacturerId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

    if (createError) {
        throw createError;
    }

    return createdProduct.id;
}

/**
 * 通用文件上传并记录资产表的方法
 */
async function processAndUploadAsset(localAssetsDir, mfgSlug, assetData, foreignKeyColumn, foreignKeyValue, tableName) {
    const { folder, file_name, asset_type, alt_text } = assetData;
    const normalizedFolder = normalizeStorageFolderName(folder);

    // 拼接本地路径，允许 local_assets 目录名与最终 slug 不同
    const localPath = resolveLocalAssetPath(localAssetsDir, folder, normalizedFolder, file_name);

    // 拼接云端 Storage 路径: <slug>/<folder>/<file>
    const storagePath = `${mfgSlug}/${normalizedFolder}/${file_name}`;

    if (!fs.existsSync(localPath)) {
        console.warn(`⚠️ 找不到本地文件: ${localPath}，跳过此附件。`);
        return;
    }

    const fileExt = path.extname(file_name).replace('.', '').toLowerCase();
    const fileBuffer = fs.readFileSync(localPath);
    const contentType = mime.lookup(localPath) || 'application/octet-stream';

    // 1. 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(TARGET_BUCKET)
        .upload(storagePath, fileBuffer, {
            upsert: true, // 如果文件已存在则覆盖
            contentType: contentType
        });

    if (uploadError) {
        console.error(`❌ 文件上传失败 [${storagePath}]:`, uploadError.message);
        return;
    }
    console.log(`✅ 文件已上传至 Storage: ${TARGET_BUCKET}/${storagePath}`);

    const { data: existingAsset } = await supabase
        .from(tableName)
        .select('id')
        .eq(foreignKeyColumn, foreignKeyValue)
        .eq('storage_bucket', TARGET_BUCKET)
        .eq('storage_path', storagePath)
        .maybeSingle();

    if (existingAsset) {
        // 如果资产记录存在，更新 alt_text 和 order
        await supabase.from(tableName).update({ 
            alt_text, 
            order: assetData.order || 0,
            updated_at: new Date().toISOString() 
        }).eq('id', existingAsset.id);
        console.log(`ℹ️ 资产记录已存在，已更新信息 [${tableName} - ${file_name}]`);
        return;
    }

    // 2. 将数据插入对应的资产关系表
    const assetRecord = {
        [foreignKeyColumn]: foreignKeyValue,
        asset_type: asset_type,
        alt_text: alt_text,
        order: assetData.order || 0,
        storage_bucket: TARGET_BUCKET,
        storage_path: storagePath,
        file_name: file_name,
        file_type: fileExt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { error: dbError } = await supabase.from(tableName).insert(assetRecord);

    if (dbError) {
        console.error(`❌ 资产记录插入数据库失败 [${tableName} - ${file_name}]:`, dbError.message);
    } else {
        console.log(`✅ 资产记录写入数据库成功 [${tableName}]`);
    }
}

async function runImport() {
    console.log('🚀 开始按公司分类目录导入数据...');
    const dataDir = path.join(__dirname, 'data');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'data_payload.json' && f !== 'sync_config.json');
    let payload = [];
    
    for (const file of files) {
        const rawData = fs.readFileSync(path.join(dataDir, file));
        try {
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                payload = payload.concat(parsed);
            }
        } catch (e) {
            console.error(`解析 JSON 文件失败: ${file}`, e);
        }
    }

    if (payload.length === 0) {
        console.log('没有找到有效的数据进行导入。');
        return;
    }

    // Load sync config
    const configPath = path.join(dataDir, 'sync_config.json');
    let syncTargets = null;
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.sync_targets && Array.isArray(config.sync_targets)) {
            syncTargets = new Set(config.sync_targets);
            console.log(`📝 已加载白名单配置，仅同步以下公司: ${config.sync_targets.join(', ')}`);
        }
    }

    for (const item of payload) {
        const mfgSlug = item.manufacturer.slug;
        
        if (syncTargets && !syncTargets.has(mfgSlug)) {
            console.log(`\n⏭️ 跳过公司: ${mfgSlug} (不在 sync_config.json 的白名单中)`);
            continue;
        }

        const localAssetsDir = item.local_assets_dir || mfgSlug;
        console.log(`\n===========================================`);
        console.log(`⏳ 正在处理公司: ${mfgSlug}`);
        console.log(`===========================================`);

        let mfgId;
        try {
            mfgId = await findOrCreateManufacturer(item.manufacturer);
        } catch (mfgError) {
            console.error(`❌ 工厂数据插入失败:`, mfgError.message);
            continue; // 核心数据失败，跳过该公司的后续处理
        }

        console.log(`✅ 工厂数据插入成功! UUID: ${mfgId}`);

        // --- Clean up orphaned manufacturer assets ---
        const expectedMfgAssets = new Set(
            (item.company_assets || []).map(a => `${mfgSlug}/${normalizeStorageFolderName(a.folder)}/${a.file_name}`)
        );

        const { data: existingMfgAssets } = await supabase
            .from('manufacturer_assets')
            .select('id, storage_path')
            .eq('manufacturer_id', mfgId);

        if (existingMfgAssets) {
            for (const asset of existingMfgAssets) {
                if (!expectedMfgAssets.has(asset.storage_path)) {
                    console.log(`🗑️ 删除冗余公司附件: ${asset.storage_path}`);
                    await supabase.from('manufacturer_assets').delete().eq('id', asset.id);
                    await supabase.storage.from(TARGET_BUCKET).remove([asset.storage_path]);
                }
            }
        }

        // --- 2. 处理公司级别资产 (Manufacturer Assets) ---
        if (item.company_assets && item.company_assets.length > 0) {
            console.log(`\n📁 开始处理公司附件...`);
            for (const asset of item.company_assets) {
                try {
                    await processAndUploadAsset(localAssetsDir, mfgSlug, asset, 'manufacturer_id', mfgId, 'manufacturer_assets');
                } catch (error) {
                    console.error(`❌ 公司附件处理失败 [${asset.file_name}]:`, error.message);
                }
            }
        }

        // --- Clean up orphaned products & product assets ---
        const expectedProductSlugs = new Set((item.products || []).map(p => p.product.slug));
        
        const { data: existingProducts } = await supabase
            .from('products')
            .select('id, slug')
            .eq('manufacturer_id', mfgId);

        if (existingProducts) {
            for (const prod of existingProducts) {
                if (!expectedProductSlugs.has(prod.slug)) {
                    console.log(`🗑️ 删除冗余产品: ${prod.slug}`);
                    // Delete all assets for this product
                    const { data: prodAssets } = await supabase
                        .from('product_assets')
                        .select('id, storage_path')
                        .eq('product_id', prod.id);
                    
                    if (prodAssets) {
                        for (const asset of prodAssets) {
                            await supabase.from('product_assets').delete().eq('id', asset.id);
                            await supabase.storage.from(TARGET_BUCKET).remove([asset.storage_path]);
                        }
                    }
                    // Delete the product itself
                    await supabase.from('products').delete().eq('id', prod.id);
                } else {
                    // Product exists in payload, cleanup its specific orphaned assets
                    const payloadProd = item.products.find(p => p.product.slug === prod.slug);
                    const expectedProdAssets = new Set(
                        (payloadProd.product_assets || []).map(a => `${mfgSlug}/${normalizeStorageFolderName(a.folder)}/${a.file_name}`)
                    );

                    const { data: prodAssets } = await supabase
                        .from('product_assets')
                        .select('id, storage_path')
                        .eq('product_id', prod.id);

                    if (prodAssets) {
                        for (const asset of prodAssets) {
                            if (!expectedProdAssets.has(asset.storage_path)) {
                                console.log(`🗑️ 删除冗余产品附件: ${asset.storage_path}`);
                                await supabase.from('product_assets').delete().eq('id', asset.id);
                                await supabase.storage.from(TARGET_BUCKET).remove([asset.storage_path]);
                            }
                        }
                    }
                }
            }
        }

        // --- 3. 处理 Products ---
        if (item.products && item.products.length > 0) {
            console.log(`\n📦 开始处理产品数据...`);
            for (const prodItem of item.products) {
                console.log(`   ⏳ 正在插入/更新产品: ${prodItem.product.slug}`);
                let prodId;
                try {
                    prodId = await findOrCreateProduct(prodItem.product, mfgId);
                } catch (prodError) {
                    console.error(`   ❌ 产品插入失败:`, prodError.message);
                    continue;
                }

                console.log(`   ✅ 产品插入成功! UUID: ${prodId}`);

                // --- 4. 处理产品级别资产 (Product Assets) ---
                if (prodItem.product_assets && prodItem.product_assets.length > 0) {
                    for (const asset of prodItem.product_assets) {
                        try {
                            await processAndUploadAsset(localAssetsDir, mfgSlug, asset, 'product_id', prodId, 'product_assets');
                        } catch (error) {
                            console.error(`❌ 产品附件处理失败 [${asset.file_name}]:`, error.message);
                        }
                    }
                }
            }
        }
    }
    console.log('\n🎉 所有公司数据和文件导入完成！');
}

runImport().catch(console.error);