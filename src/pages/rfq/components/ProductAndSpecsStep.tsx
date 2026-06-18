import type { ChangeEvent, DragEvent } from "react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FileText, UploadCloud, X } from "lucide-react"
import {
    formatFileSize,
    MAX_RFQ_ATTACHMENT_FILE_SIZE_BYTES,
    MAX_RFQ_ATTACHMENT_FILES,
    mergeRfqAttachmentFiles,
    RFQ_ATTACHMENT_ACCEPT,
    type RfqAttachmentValidationError,
} from "../../../lib/rfq/attachments"

export type RfqSpecsMode = "quick" | "advanced";

export interface RfqProductSpecsData {
    productType: string;
    customProductType: string;
    quantity: string;
    customQuantity: string;
    timeline: string;
    customTimeline: string;
    hotMediaName: string;
    hotInletFluidType: string;
    hotOutletFluidType: string;
    hotInletMassFlow: string;
    hotOutletMassFlow: string;
    hotInletVolumeFlow: string;
    hotOutletVolumeFlow: string;
    hotInletGasPhaseFraction: string;
    hotOutletGasPhaseFraction: string;
    hotIn: string;
    hotOut: string;
    hotInletDensity: string;
    hotOutletDensity: string;
    hotInletSpecificHeat: string;
    hotOutletSpecificHeat: string;
    hotInletConductivity: string;
    hotOutletConductivity: string;
    hotInletViscosity: string;
    hotOutletViscosity: string;
    coldMediaName: string;
    coldInletFluidType: string;
    coldOutletFluidType: string;
    coldInletMassFlow: string;
    coldOutletMassFlow: string;
    coldInletVolumeFlow: string;
    coldOutletVolumeFlow: string;
    coldInletGasPhaseFraction: string;
    coldOutletGasPhaseFraction: string;
    coldIn: string;
    coldOut: string;
    coldInletDensity: string;
    coldOutletDensity: string;
    coldInletSpecificHeat: string;
    coldOutletSpecificHeat: string;
    coldInletConductivity: string;
    coldOutletConductivity: string;
    coldInletViscosity: string;
    coldOutletViscosity: string;
    heatLoad: string;
    plateMaterial: string;
    customPlateMaterial: string;
    designCode: string;
    hotDesignPressure: string;
    hotTestPressure: string;
    coldDesignPressure: string;
    coldTestPressure: string;
    hotDesignTemperature: string;
    coldDesignTemperature: string;
    hotFlangeStandard: string;
    customHotFlangeStandard: string;
    coldFlangeStandard: string;
    customColdFlangeStandard: string;
    hotInletFlangeNominalDiameter: string;
    hotOutletFlangeNominalDiameter: string;
    coldInletFlangeNominalDiameter: string;
    coldOutletFlangeNominalDiameter: string;
    hotFlangeMaterial: string;
    coldFlangeMaterial: string;
    hotFlangePressureRating: string;
    coldFlangePressureRating: string;
    hotFlangeTypeSealingFace: string;
    coldFlangeTypeSealingFace: string;
    additionalNotes: string;
}

interface Option {
    id: string;
    label: string;
}

interface ProductAndSpecsStepProps {
    data: RfqProductSpecsData;
    mode: RfqSpecsMode;
    files: File[];
    onChange: (data: Partial<RfqProductSpecsData>) => void;
    onFilesChange: (files: File[]) => void;
    onModeChange: (mode: RfqSpecsMode) => void;
}

export function ProductAndSpecsStep({ data, mode, files, onChange, onFilesChange, onModeChange }: ProductAndSpecsStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachmentError, setAttachmentError] = useState<string | null>(null);
    const productTypes = t("productTypes", { returnObjects: true }) as Option[];
    const quantities = t("quantities", { returnObjects: true }) as Option[];
    const timelines = t("timelines", { returnObjects: true }) as Option[];
    const fluidTypes = t("fluidTypes", { returnObjects: true }) as Option[];
    const plateMaterials = t("plateMaterials", { returnObjects: true }) as Option[];
    const flangeStandards = t("flangeStandards", { returnObjects: true }) as Option[];

    const MAX_NOTES_LENGTH = 500;
    const isGasLiquid = (fluidType: string) => fluidType === "gas_liquid";

    const inputClass = "h-9 w-full rounded-sm border border-slate-200 bg-white px-2 py-1 text-[11px] ring-offset-background transition-all [appearance:textfield] focus:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 sm:h-10 sm:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    const invalidInputClass = ""
    const disabledInputClass = `${inputClass} cursor-not-allowed !border-slate-200 !bg-slate-100 text-slate-400 ring-0`
    const selectClass = `${inputClass} appearance-none px-2 pr-7 text-[10px] sm:px-3 sm:pr-8 sm:text-[11px]`
    const compactLabelClass = "text-[9px] font-semibold text-slate-600 leading-tight sm:text-[10px]"
    const requiredLabelClass = "text-[9px] font-semibold leading-tight text-slate-700 sm:text-[10px]"
    const sectionLabelClass = "text-[10px] font-bold tracking-wide text-slate-800 sm:text-[10px]"
    const invalidInputStyle: React.CSSProperties | undefined = undefined;
    const disabledInputStyle = { backgroundColor: "#f1f5f9", borderColor: "#e2e8f0" };

    const requiredBadge = <span className="ml-1 text-sm font-black leading-none text-red-500">*</span>
    const getFieldId = (field: keyof RfqProductSpecsData) => `rfq-${String(field)}`;

    const selectChevron = (
        <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400 sm:right-2 sm:h-3.5 sm:w-3.5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8l4 4 4-4" />
        </svg>
    )

    const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        let value = event.target.value;
        if (value.length > MAX_NOTES_LENGTH) return;

        value = value.replace(/[<>]/g, "");
        onChange({ additionalNotes: value });
    }

    const getAttachmentErrorMessage = (error: RfqAttachmentValidationError) => {
        if (error.code === "too_many_files") {
            return t("step2.attachmentErrors.tooManyFiles", {
                defaultValue: "Only {{maxFiles}} files can be uploaded.",
                maxFiles: error.maxFiles || MAX_RFQ_ATTACHMENT_FILES,
            });
        }

        if (error.code === "file_too_large") {
            return t("step2.attachmentErrors.fileTooLarge", {
                defaultValue: "{{fileName}} is larger than {{maxFileSize}}.",
                fileName: error.fileName || t("step2.attachmentErrors.thisFile", { defaultValue: "This file" }),
                maxFileSize: error.maxFileSize || formatFileSize(MAX_RFQ_ATTACHMENT_FILE_SIZE_BYTES),
            });
        }

        return t("step2.attachmentErrors.unsupportedFileType", {
            defaultValue: "{{fileName}} is not a supported file type.",
            fileName: error.fileName || t("step2.attachmentErrors.thisFile", { defaultValue: "This file" }),
        });
    }

    const handleAttachmentSelection = (selectedFiles: File[]) => {
        const result = mergeRfqAttachmentFiles(files, selectedFiles);
        onFilesChange(result.files);
        setAttachmentError(result.errors[0] ? getAttachmentErrorMessage(result.errors[0]) : null);
    }

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleAttachmentSelection(Array.from(event.target.files || []));
        event.target.value = "";
    }

    const handleAttachmentDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        handleAttachmentSelection(Array.from(event.dataTransfer.files || []));
    }

    const removeAttachment = (index: number) => {
        onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
        setAttachmentError(null);
    }

    const renderSelect = (
        field: keyof RfqProductSpecsData,
        options: Option[],
        placeholder: string,
        required = false,
    ) => (
        <div className="relative">
            <select
                id={getFieldId(field)}
                name={String(field)}
                className={selectClass}
                value={data[field] || ""}
                onChange={(event) => updateField(field, event.target.value)}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                ))}
            </select>
            {selectChevron}
            {required && !data[field] && <span className="sr-only">{t("step2.requiredBadge")}</span>}
        </div>
    )

    const mirrorOutlet = (field: keyof RfqProductSpecsData, value: string) => {
        const fieldName = String(field);
        const side = fieldName.startsWith("hot") ? "hot" : fieldName.startsWith("cold") ? "cold" : null;
        if (!side) return {};

        if (fieldName === `${side}In`) return { [`${side}Out`]: value };

        const mirroredFields = [
            "FluidType",
            "MassFlow",
            "VolumeFlow",
            "GasPhaseFraction",
            "Density",
            "SpecificHeat",
            "Conductivity",
            "Viscosity",
            "FlangeNominalDiameter",
        ];
        const mirroredSuffix = mirroredFields.find((suffix) => fieldName === `${side}Inlet${suffix}`);

        return mirroredSuffix ? { [`${side}Outlet${mirroredSuffix}`]: value } : {};
    }

    const updateField = (field: keyof RfqProductSpecsData, value: string) => {
        const fieldName = String(field);
        const side = fieldName.startsWith("hot") ? "hot" : fieldName.startsWith("cold") ? "cold" : null;
        const gasFractionReset = side && fieldName.endsWith("FluidType") && !isGasLiquid(value)
            ? fieldName.includes("Inlet")
                ? {
                    [`${side}InletGasPhaseFraction`]: "",
                    [`${side}OutletGasPhaseFraction`]: "",
                }
                : { [`${side}OutletGasPhaseFraction`]: "" }
            : {};

        onChange({ [field]: value, ...mirrorOutlet(field, value), ...gasFractionReset } as Partial<RfqProductSpecsData>);
    }

    const renderInput = (field: keyof RfqProductSpecsData, placeholder = "", type: "text" = "text", disabled = false, invalid = false) => (
        <input
            id={getFieldId(field)}
            name={String(field)}
            aria-label={String(field)}
            type={type}
            className={disabled ? disabledInputClass : `${inputClass} ${invalid ? invalidInputClass : ""}`}
            style={disabled ? disabledInputStyle : invalid ? invalidInputStyle : undefined}
            value={data[field] || ""}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(event) => updateField(field, event.target.value)}
        />
    )

    const renderRow = ({
        label,
        inletField,
        outletField,
        placeholder,
        type = "text",
        required = false,
        inletDisabled = false,
        outletDisabled = false,
    }: {
        label: string;
        inletField: keyof RfqProductSpecsData;
        outletField: keyof RfqProductSpecsData;
        placeholder?: string;
        type?: "text";
        required?: boolean;
        inletDisabled?: boolean;
        outletDisabled?: boolean;
    }) => (
        <div className="grid grid-cols-[minmax(48px,0.58fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] items-center gap-2">
            <div className={required ? requiredLabelClass : compactLabelClass}>{label}{required && requiredBadge}</div>
            <div>{renderInput(inletField, placeholder, type, inletDisabled, required && !(data[inletField] || data[outletField]))}</div>
            <div>{renderInput(outletField, placeholder, type, outletDisabled, required && !(data[inletField] || data[outletField]))}</div>
        </div>
    )

    const renderSideThermalSection = ({
        side,
        title,
        accentClass,
    }: {
        side: "hot" | "cold";
        title: string;
        accentClass: string;
    }) => {
        const mediaNameField = `${side}MediaName` as keyof RfqProductSpecsData;
        const inletFluidTypeField = `${side}InletFluidType` as keyof RfqProductSpecsData;
        const outletFluidTypeField = `${side}OutletFluidType` as keyof RfqProductSpecsData;
        const inletMassFlowField = `${side}InletMassFlow` as keyof RfqProductSpecsData;
        const outletMassFlowField = `${side}OutletMassFlow` as keyof RfqProductSpecsData;
        const inletVolumeFlowField = `${side}InletVolumeFlow` as keyof RfqProductSpecsData;
        const outletVolumeFlowField = `${side}OutletVolumeFlow` as keyof RfqProductSpecsData;
        const inletGasPhaseFractionField = `${side}InletGasPhaseFraction` as keyof RfqProductSpecsData;
        const outletGasPhaseFractionField = `${side}OutletGasPhaseFraction` as keyof RfqProductSpecsData;
        const inletField = `${side}In` as keyof RfqProductSpecsData;
        const outletField = `${side}Out` as keyof RfqProductSpecsData;
        const inletDensityField = `${side}InletDensity` as keyof RfqProductSpecsData;
        const outletDensityField = `${side}OutletDensity` as keyof RfqProductSpecsData;
        const inletSpecificHeatField = `${side}InletSpecificHeat` as keyof RfqProductSpecsData;
        const outletSpecificHeatField = `${side}OutletSpecificHeat` as keyof RfqProductSpecsData;
        const inletConductivityField = `${side}InletConductivity` as keyof RfqProductSpecsData;
        const outletConductivityField = `${side}OutletConductivity` as keyof RfqProductSpecsData;
        const inletViscosityField = `${side}InletViscosity` as keyof RfqProductSpecsData;
        const outletViscosityField = `${side}OutletViscosity` as keyof RfqProductSpecsData;
        const inletFluidTypeValue = data[inletFluidTypeField] || "";
        const outletFluidTypeValue = data[outletFluidTypeField] || "";
        const inletGasPhaseFractionRequired = isGasLiquid(inletFluidTypeValue);
        const outletGasPhaseFractionRequired = isGasLiquid(outletFluidTypeValue);
        const sideFrameClass = side === "hot" ? "border-orange-300 bg-orange-50/20" : "border-blue-300 bg-blue-50/20";

        return (
            <div className={`min-w-0 space-y-3 rounded-sm border-2 p-3 shadow-sm ${sideFrameClass}`}>
                <div className="border-b border-slate-100 pb-2">
                    <span className={`text-xs font-bold tracking-wide ${accentClass}`}>{title}</span>
                </div>

                <div>
                    <label htmlFor={getFieldId(mediaNameField)} className={compactLabelClass}>{t("step2.mediaNameLabel")}</label>
                    <input
                        id={getFieldId(mediaNameField)}
                        name={String(mediaNameField)}
                        className={inputClass}
                        value={data[mediaNameField] || ""}
                        onChange={(event) => updateField(mediaNameField, event.target.value)}
                    />
                </div>

                <div className="space-y-2 rounded-sm bg-slate-50 p-2">
                    <div className="grid grid-cols-[minmax(48px,0.58fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] items-end gap-2">
                        <div className={requiredLabelClass}>{t("step2.fluidTypeLabel")}{requiredBadge}</div>
                        <div className={compactLabelClass}>{t("step2.inletPropertyLabel")}</div>
                        <div className={compactLabelClass}>{t("step2.outletPropertyLabel")}</div>
                    </div>
                    <div className="grid grid-cols-[minmax(48px,0.58fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] items-center gap-2">
                        <div />
                        <div className="relative">
                            <select
                                id={getFieldId(inletFluidTypeField)}
                                name={String(inletFluidTypeField)}
                                aria-label={`${title} ${t("step2.inletPropertyLabel")} ${t("step2.fluidTypeLabel")}`}
                                className={selectClass}
                                value={inletFluidTypeValue}
                                onChange={(event) => updateField(inletFluidTypeField, event.target.value)}
                            >
                                <option value="">{t("step2.fluidTypePlaceholder")}</option>
                                {fluidTypes.map((option) => (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                ))}
                            </select>
                            {selectChevron}
                        </div>
                        <div className="relative">
                            <select
                                id={getFieldId(outletFluidTypeField)}
                                name={String(outletFluidTypeField)}
                                aria-label={`${title} ${t("step2.outletPropertyLabel")} ${t("step2.fluidTypeLabel")}`}
                                className={selectClass}
                                value={outletFluidTypeValue}
                                onChange={(event) => updateField(outletFluidTypeField, event.target.value)}
                            >
                                <option value="">{t("step2.fluidTypePlaceholder")}</option>
                                {fluidTypes.map((option) => (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                ))}
                            </select>
                            {selectChevron}
                        </div>
                    </div>

                    <div className="grid grid-cols-[minmax(48px,0.58fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] items-center gap-2">
                        <div className={inletGasPhaseFractionRequired || outletGasPhaseFractionRequired ? requiredLabelClass : compactLabelClass}>
                            {t("step2.gasPhaseFractionLabel")}{(inletGasPhaseFractionRequired || outletGasPhaseFractionRequired) && requiredBadge}
                        </div>
                        <div>{renderInput(inletGasPhaseFractionField, "", "text", !inletGasPhaseFractionRequired, inletGasPhaseFractionRequired && !data[inletGasPhaseFractionField])}</div>
                        <div>{renderInput(outletGasPhaseFractionField, "", "text", !outletGasPhaseFractionRequired, outletGasPhaseFractionRequired && !data[outletGasPhaseFractionField])}</div>
                    </div>
                    {renderRow({
                        label: t("step2.massFlowLabel"),
                        inletField: inletMassFlowField,
                        outletField: outletMassFlowField,
                        required: true,
                    })}
                    {renderRow({
                        label: t("step2.volumeFlowLabel"),
                        inletField: inletVolumeFlowField,
                        outletField: outletVolumeFlowField,
                    })}
                    {renderRow({ label: t("step2.temperatureLabel"), inletField, outletField })}
                    {renderRow({ label: t("step2.densityLabel"), inletField: inletDensityField, outletField: outletDensityField })}
                    {renderRow({ label: t("step2.specificHeatLabel"), inletField: inletSpecificHeatField, outletField: outletSpecificHeatField })}
                    {renderRow({ label: t("step2.conductivityLabel"), inletField: inletConductivityField, outletField: outletConductivityField })}
                    {renderRow({ label: t("step2.viscosityLabel"), inletField: inletViscosityField, outletField: outletViscosityField })}
                </div>
            </div>
        )
    }

    const renderSideEquipmentSection = ({
        side,
        title,
        accentClass,
    }: {
        side: "hot" | "cold";
        title: string;
        accentClass: string;
    }) => {
        const designPressureField = `${side}DesignPressure` as keyof RfqProductSpecsData;
        const testPressureField = `${side}TestPressure` as keyof RfqProductSpecsData;
        const designTemperatureField = `${side}DesignTemperature` as keyof RfqProductSpecsData;
        const flangeStandardField = `${side}FlangeStandard` as keyof RfqProductSpecsData;
        const customFlangeStandardField = `custom${side === "hot" ? "Hot" : "Cold"}FlangeStandard` as keyof RfqProductSpecsData;
        const inletFlangeNominalDiameterField = `${side}InletFlangeNominalDiameter` as keyof RfqProductSpecsData;
        const outletFlangeNominalDiameterField = `${side}OutletFlangeNominalDiameter` as keyof RfqProductSpecsData;
        const flangeMaterialField = `${side}FlangeMaterial` as keyof RfqProductSpecsData;
        const flangePressureRatingField = `${side}FlangePressureRating` as keyof RfqProductSpecsData;
        const flangeTypeSealingFaceField = `${side}FlangeTypeSealingFace` as keyof RfqProductSpecsData;
        const flangeStandardValue = data[flangeStandardField] || "";
        const sideFrameClass = side === "hot" ? "border-orange-300 bg-orange-50/20" : "border-blue-300 bg-blue-50/20";

        return (
            <div className={`min-w-0 space-y-3 rounded-sm border-2 p-3 shadow-sm ${sideFrameClass}`}>
                <div className="border-b border-slate-100 pb-2">
                    <span className={`text-xs font-bold tracking-wide ${accentClass}`}>{title}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor={getFieldId(designPressureField)} className={compactLabelClass}>{t("step2.designPressureLabel")}</label>
                        {renderInput(designPressureField)}
                    </div>
                    <div>
                        <label htmlFor={getFieldId(testPressureField)} className={compactLabelClass}>{t("step2.testPressureLabel")}</label>
                        {renderInput(testPressureField)}
                    </div>
                </div>

                <div>
                    <label htmlFor={getFieldId(designTemperatureField)} className={compactLabelClass}>{t("step2.designTemperatureLabel")}</label>
                    {renderInput(designTemperatureField)}
                </div>

                <div>
                    <label htmlFor={getFieldId(flangeStandardField)} className={requiredLabelClass}>{t("step2.flangeStandardLabel")}{requiredBadge}</label>
                    <div className="relative">
                        <select
                            id={getFieldId(flangeStandardField)}
                            name={String(flangeStandardField)}
                            className={selectClass}
                            value={flangeStandardValue}
                            onChange={(event) => updateField(flangeStandardField, event.target.value)}
                        >
                            <option value="">{t("step2.flangeStandardPlaceholder")}</option>
                            {flangeStandards.map((option) => (
                                <option key={option.id} value={option.id}>{option.label}</option>
                            ))}
                        </select>
                        {selectChevron}
                    </div>
                </div>

                {flangeStandardValue === "other" && (
                    <div>
                        <label htmlFor={getFieldId(customFlangeStandardField)} className={compactLabelClass}>{t("step2.customFlangeStandardLabel")}</label>
                        {renderInput(customFlangeStandardField, t("step2.customFlangeStandardPlaceholder"), "text", false, !data[customFlangeStandardField])}
                    </div>
                )}

                <div className="space-y-2 rounded-sm bg-slate-50 p-2">
                    <div className="grid grid-cols-[minmax(48px,0.58fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] gap-2">
                        <div />
                        <div className={compactLabelClass}>{t("step2.inletPropertyLabel")}</div>
                        <div className={compactLabelClass}>{t("step2.outletPropertyLabel")}</div>
                    </div>
                    {renderRow({
                        label: t("step2.flangeNominalDiameterLabel"),
                        inletField: inletFlangeNominalDiameterField,
                        outletField: outletFlangeNominalDiameterField,
                        placeholder: t("step2.flangeNominalDiameterPlaceholder"),
                        type: "text",
                    })}
                </div>

                <div>
                    <label htmlFor={getFieldId(flangeMaterialField)} className={compactLabelClass}>{t("step2.flangeMaterialLabel")}</label>
                    {renderInput(flangeMaterialField, t("step2.flangeMaterialPlaceholder"), "text")}
                </div>
                <div>
                    <label htmlFor={getFieldId(flangePressureRatingField)} className={compactLabelClass}>{t("step2.flangePressureRatingLabel")}</label>
                    {renderInput(flangePressureRatingField, t("step2.flangePressureRatingPlaceholder"), "text")}
                </div>
                <div>
                    <label htmlFor={getFieldId(flangeTypeSealingFaceField)} className={compactLabelClass}>{t("step2.flangeTypeSealingFaceLabel")}</label>
                    {renderInput(flangeTypeSealingFaceField, t("step2.flangeTypeSealingFacePlaceholder"), "text")}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {t("step2.requestModeTitle", { defaultValue: "Request detail level" })}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {([
                        ["quick", t("step2.quickModeTitle", { defaultValue: "Quick quote request" }), t("step2.quickModeDesc", { defaultValue: "Use this when you know the application but not all design parameters yet." })],
                        ["advanced", t("step2.advancedModeTitle", { defaultValue: "Detailed quote request" }), t("step2.advancedModeDesc", { defaultValue: "Use this when you already have operating data, materials, and connection standards." })],
                    ] as const).map(([value, title, description]) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={mode === value}
                            onClick={() => onModeChange(value)}
                            className={`flex min-h-20 flex-col gap-1 rounded-sm border p-4 text-left transition-colors ${mode === value ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-slate-200 bg-white hover:border-slate-300"}`}
                        >
                            <span className="text-sm font-bold text-slate-900">{title}</span>
                            <span className="text-xs leading-relaxed text-slate-500">{description}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {t("step2.basicRequirementTitle", { defaultValue: "Basic requirement" })}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                        <label htmlFor={getFieldId("productType")} className={requiredLabelClass}>
                            {t("step2.productTypeLabel", { defaultValue: "Product type" })}{requiredBadge}
                        </label>
                        {renderSelect("productType", productTypes, t("step2.productTypePlaceholder", { defaultValue: "Select" }), true)}
                        {data.productType === "other" && (
                            <div>
                                <label htmlFor={getFieldId("customProductType")} className={requiredLabelClass}>
                                    {t("step2.customProductTypeLabel", { defaultValue: "Other product type" })}{requiredBadge}
                                </label>
                                {renderInput("customProductType", t("step2.customProductTypePlaceholder", { defaultValue: "Please specify the product type..." }), "text", false, !data.customProductType)}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={getFieldId("quantity")} className={compactLabelClass}>
                            {t("step1.quantityLabel", { defaultValue: "Required quantity" })}
                        </label>
                        {renderSelect("quantity", quantities, t("step2.quantityPlaceholder", { defaultValue: "Select" }))}
                        {data.quantity === "other" && (
                            <div>
                                <label htmlFor={getFieldId("customQuantity")} className={compactLabelClass}>
                                    {t("step1.customQuantityPlaceholder", { defaultValue: "Please specify the required quantity..." })}
                                </label>
                                {renderInput("customQuantity", t("step1.customQuantityPlaceholder", { defaultValue: "Please specify the required quantity..." }))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={getFieldId("timeline")} className={compactLabelClass}>
                            {t("step1.timelineLabel", { defaultValue: "Expected delivery timeline" })}
                        </label>
                        {renderSelect("timeline", timelines, t("step2.timelinePlaceholder", { defaultValue: "Select" }))}
                        {data.timeline === "other" && (
                            <div>
                                <label htmlFor={getFieldId("customTimeline")} className={compactLabelClass}>
                                    {t("step1.customTimelinePlaceholder", { defaultValue: "Please specify your timeline expectations..." })}
                                </label>
                                {renderInput("customTimeline", t("step1.customTimelinePlaceholder", { defaultValue: "Please specify your timeline expectations..." }))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                    <label htmlFor={getFieldId("additionalNotes")} className={sectionLabelClass}>
                        {t("step2.additionalNotesLabel")}{mode === "quick" && requiredBadge}
                    </label>
                    <div className="relative mt-1">
                        <textarea
                            id={getFieldId("additionalNotes")}
                            name="additionalNotes"
                            className="flex w-full min-h-[100px] rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 resize-y"
                            placeholder={t("step2.quickAdditionalNotesPlaceholder", {
                                defaultValue: "Describe the duty, application, fluids, target temperature, drawing availability, certification needs, or any known constraints.",
                            })}
                            value={data.additionalNotes || ""}
                            onChange={handleNotesChange}
                        />
                        <div className={`absolute bottom-3 right-4 text-xs font-semibold ${data.additionalNotes?.length > MAX_NOTES_LENGTH - 50 ? "text-amber-500" : "text-slate-400"}`}>
                            {data.additionalNotes?.length || 0} / {MAX_NOTES_LENGTH}
                        </div>
                    </div>
                </div>
            </div>

            {mode === "quick" && null}
            {mode === "advanced" && (
                <>
            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">{t("step2.thermalSpecsTitle")}</h3>
                        {t("step2.thermalSpecsSubtitle") && <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">{t("step2.thermalSpecsSubtitle")}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {renderSideThermalSection({
                        side: "hot",
                        title: t("step2.hotSide"),
                        accentClass: "text-rose-600",
                    })}
                    {renderSideThermalSection({
                        side: "cold",
                        title: t("step2.coldSide"),
                        accentClass: "text-blue-600",
                    })}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                    <label htmlFor={getFieldId("heatLoad")} className={requiredLabelClass}>{t("step2.heatLoadLabel")}{requiredBadge}</label>
                    {renderInput("heatLoad", "", "text", false, !data.heatLoad)}
                </div>
            </div>

            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">{t("step2.equipmentParamsTitle")}</h3>
                    {t("step2.equipmentParamsSubtitle") && <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">{t("step2.equipmentParamsSubtitle")}</p>}
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label htmlFor={getFieldId("designCode")} className={sectionLabelClass}>{t("step2.designCodeLabel")}</label>
                        {renderInput("designCode", t("step2.designCodePlaceholder"), "text")}
                    </div>
                    <div>
                        <label htmlFor={getFieldId("plateMaterial")} className={requiredLabelClass}>{t("step2.plateMaterialLabel")}{requiredBadge}</label>
                        <div className="relative">
                            <select
                                id={getFieldId("plateMaterial")}
                                name="plateMaterial"
                                className={selectClass}
                                value={data.plateMaterial}
                                onChange={(event) => updateField("plateMaterial", event.target.value)}
                            >
                                <option value="">{t("step2.plateMaterialPlaceholder")}</option>
                                {plateMaterials.map((option) => (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                ))}
                            </select>
                            {selectChevron}
                        </div>
                    </div>
                </div>

                {data.plateMaterial === "other" && (
                    <div className="mt-3">
                        {renderInput("customPlateMaterial", t("step2.customPlateMaterialPlaceholder"), "text", false, !data.customPlateMaterial)}
                    </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 md:grid-cols-2">
                    {renderSideEquipmentSection({
                        side: "hot",
                        title: t("step2.hotSide"),
                        accentClass: "text-rose-600",
                    })}
                    {renderSideEquipmentSection({
                        side: "cold",
                        title: t("step2.coldSide"),
                        accentClass: "text-blue-600",
                    })}
                </div>

            </div>
                </>
            )}

            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {t("step2.attachmentsTitle", { defaultValue: "Attachments" })}
                    </h3>
                    <span className="rounded-sm bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {files.length}/{MAX_RFQ_ATTACHMENT_FILES}
                    </span>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept={RFQ_ATTACHMENT_ACCEPT}
                    onChange={handleFileInputChange}
                />

                <div
                    role="button"
                    tabIndex={0}
                    className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleAttachmentDrop}
                >
                    <UploadCloud className="h-8 w-8 text-slate-500" />
                    <span className="mt-3 text-sm font-bold text-slate-800">
                        {t("step2.attachmentsDropLabel", { defaultValue: "Click to upload or drag files here" })}
                    </span>
                    <span className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500">
                        {t("step2.attachmentsHelp", {
                            defaultValue: `Images, PDF, Word, Excel, and CSV files. ${formatFileSize(MAX_RFQ_ATTACHMENT_FILE_SIZE_BYTES)} each.`,
                        })}
                    </span>
                </div>

                {attachmentError && (
                    <div className="mt-3 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                        {attachmentError}
                    </div>
                )}

                {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                            <div key={`${file.name}-${file.lastModified}-${file.size}`} className="flex items-center gap-3 rounded-sm border border-slate-200 bg-white px-3 py-2">
                                <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-xs font-bold text-slate-800">{file.name}</div>
                                    <div className="text-[11px] text-slate-500">{formatFileSize(file.size)}</div>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                    aria-label={t("step2.removeAttachmentLabel", { defaultValue: "Remove file" })}
                                    onClick={() => removeAttachment(index)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
