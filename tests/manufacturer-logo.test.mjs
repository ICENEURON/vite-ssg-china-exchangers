import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importTsModule(sourcePath) {
  assert.equal(existsSync(sourcePath), true, `${sourcePath} should exist`);

  const source = readFileSync(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const tempDir = join(process.cwd(), "node_modules", ".tmp", "tests");
  mkdirSync(tempDir, { recursive: true });
  const modulePath = join(tempDir, `manufacturer-logo-${Date.now()}.mjs`);
  await import("node:fs/promises").then(({ writeFile }) => writeFile(modulePath, transpiled));
  return import(pathToFileURL(modulePath).href);
}

test("manufacturer logos use the uploaded company_logo path and configured auto sizing", async () => {
  const {
    manufacturerLogoClassName,
    getManufacturerLogoClassName,
    getManufacturerLogoAlt,
    getManufacturerLogoSrc,
  } = await importTsModule("src/utils/manufacturer-logo.ts");

  assert.equal(
    getManufacturerLogoSrc("shanghai-accessen-co-ltd"),
    "/storage/assets/shanghai-accessen-co-ltd/company_logo/logo.png",
  );
  assert.equal(getManufacturerLogoSrc("  "), null);
  assert.equal(getManufacturerLogoAlt("Shanghai Accessen Co., Ltd."), "Shanghai Accessen Co., Ltd. logo");
  assert.match(manufacturerLogoClassName, /(^|\s)h-\[42px\](\s|$)/);
  assert.match(manufacturerLogoClassName, /(^|\s)w-auto(\s|$)/);
  assert.match(getManufacturerLogoClassName("shanghai-accessen-co-ltd"), /(^|\s)h-\[42px\](\s|$)/);
  assert.match(getManufacturerLogoClassName("shanghai-heat-transfer-equipment-co-ltd"), /(^|\s)h-\[42px\](\s|$)/);
  assert.match(getManufacturerLogoClassName("shanghai-heat-transfer-equipment-co-ltd"), /(^|\s)w-auto(\s|$)/);
});

test("detail page logos use a compact opaque square white wrapper", () => {
  const detailPages = [
    "src/pages/manufacturers/company/index.tsx",
    "src/pages/products/product/index.tsx",
  ];

  for (const pagePath of detailPages) {
    const source = readFileSync(pagePath, "utf8");
    const wrapperMatch = source.match(/<div[^>]*>\s*<ManufacturerLogo/s);

    assert.notEqual(wrapperMatch, null, `${pagePath} should wrap ManufacturerLogo`);
    assert.match(wrapperMatch[0], /bg-white(?=\s)/, `${pagePath} should use an opaque white wrapper`);
    assert.match(wrapperMatch[0], /-mb-3/, `${pagePath} should place the logo closer to the title`);
    assert.match(wrapperMatch[0], /px-2/, `${pagePath} should use compact horizontal padding`);
    assert.match(wrapperMatch[0], /py-1/, `${pagePath} should use compact vertical padding`);
    assert.doesNotMatch(wrapperMatch[0], /rounded/, `${pagePath} wrapper should not have rounded corners`);
    assert.doesNotMatch(wrapperMatch[0], /shadow/, `${pagePath} wrapper should not use shadow`);
  }

  const manufacturerDetailSource = readFileSync("src/pages/manufacturers/company/index.tsx", "utf8");
  const manufacturerTitleStack = manufacturerDetailSource.match(/<div className="min-w-0[^"]*">/);

  assert.notEqual(manufacturerTitleStack, null, "manufacturer detail page should have a title stack");
  assert.match(manufacturerTitleStack[0], /flex-col/, "manufacturer detail title stack should use the same column layout as product detail");
  assert.match(manufacturerTitleStack[0], /gap-6/, "manufacturer detail title stack should use the same gap as product detail");
  assert.doesNotMatch(manufacturerTitleStack[0], /space-y-6/, "manufacturer detail title stack should not use a separate spacing model");
});
