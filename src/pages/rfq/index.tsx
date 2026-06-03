import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from "react-router-dom"
import { SeoHead } from '../../components/seo/SeoHead'
import { Button } from "../../components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { ProgressTracker } from "./components/ProgressTracker"
import { ContextStep, type RqfContextData } from "./components/ContextStep"
import { ProductAndSpecsStep, type RfqProductSpecsData, type RfqSpecsMode } from "./components/ProductAndSpecsStep"
import { EmailVerificationStep } from "./components/EmailVerificationStep"
import { FinalConfirmStep } from "./components/FinalConfirmStep"
import { useTranslation } from "react-i18next"
import { recordRFQEvent, submitRFQ, uploadRFQFiles } from "../../lib/supabase/db"
import type { RFQSubmissionData } from "../../lib/supabase/db"
import { trackEvent } from "../../lib/analytics/cookie-consent"
import { clearRfqDraftId, getMarketingAttributionPayload, getOrCreateRfqDraftId, getOrCreateVisitorId } from "../../lib/analytics/marketing-attribution"
import { getPathWithoutLanguage, useCurrentLanguage } from "../../utils/language-routing"
import { QUOTE_REQUEST_SOURCE_URL_STORAGE_KEY } from "../../utils/rfq-routing/link"
import manufacturersData from "../../data/manufacturers.json"
import { ensureLanguageResource, getLoadedTranslationResource } from "../../i18n/config"
import type { SupportedLanguage } from "../../locales/languages"
import type { LocaleResource } from "../../locales/resources"

interface SourceManufacturer {
  slug: string;
  name: Partial<Record<LocaleCode, string>> & { en: string };
}

type LocaleCode = SupportedLanguage;
type LocaleOption = { id: string; label: string };
type RfqLocale = LocaleResource["pages"]["rfq"];

const LABEL_LOCALE_CODES = ["en", "zh"] as const satisfies readonly LocaleCode[];
type LabelLocaleCode = typeof LABEL_LOCALE_CODES[number];
type LocalizedLabel = Record<LabelLocaleCode, string>;
type LocalizedOptionLabels = Record<string, LocalizedLabel>;
type RfqPayloadLabels = {
  fluidTypeLabels: LocalizedOptionLabels;
  materialLabels: LocalizedOptionLabels;
  flangeStandardLabels: LocalizedOptionLabels;
  productTypeLabels: LocalizedOptionLabels;
  quantityLabels: LocalizedOptionLabels;
  timelineLabels: LocalizedOptionLabels;
};

function getRfqLocale(locale: LocaleCode): RfqLocale {
  const resource = getLoadedTranslationResource(locale) as LocaleResource | undefined;
  const fallbackResource = getLoadedTranslationResource("en") as LocaleResource | undefined;
  const rfqLocale = resource?.pages.rfq || fallbackResource?.pages.rfq;

  if (!rfqLocale) {
    throw new Error(`RFQ locale is not loaded for ${locale}`);
  }

  return rfqLocale as RfqLocale;
}

async function ensureRfqPayloadLabelResources() {
  await Promise.all(LABEL_LOCALE_CODES.map((locale) => ensureLanguageResource(locale)));
}

function getRfqParameterLabel(key: keyof RfqLocale["parameterLabels"]): LocalizedLabel {
  return LABEL_LOCALE_CODES.reduce((labels, locale) => {
    labels[locale] = getRfqLocale(locale).parameterLabels[key] || getRfqLocale("en").parameterLabels[key];
    return labels;
  }, {} as LocalizedLabel);
}

function sameLocalizedLabel(value: string): LocalizedLabel {
  return LABEL_LOCALE_CODES.reduce((labels, locale) => {
    labels[locale] = value;
    return labels;
  }, {} as LocalizedLabel);
}

function getLocalizedOptionLabels(collection: "fluidTypes" | "plateMaterials" | "flangeStandards" | "productTypes" | "quantities" | "timelines") {
  const optionLabels: Record<string, LocalizedLabel> = {};

  LABEL_LOCALE_CODES.forEach((locale) => {
    (getRfqLocale(locale)[collection] as LocaleOption[]).forEach((option) => {
      optionLabels[option.id] = {
        ...(optionLabels[option.id] || sameLocalizedLabel(option.id)),
        [locale]: option.label,
      };
    });
  });

  return optionLabels;
}

function createRfqPayloadLabels(): RfqPayloadLabels {
  return {
    fluidTypeLabels: getLocalizedOptionLabels("fluidTypes"),
    materialLabels: getLocalizedOptionLabels("plateMaterials"),
    flangeStandardLabels: getLocalizedOptionLabels("flangeStandards"),
    productTypeLabels: getLocalizedOptionLabels("productTypes"),
    quantityLabels: getLocalizedOptionLabels("quantities"),
    timelineLabels: getLocalizedOptionLabels("timelines"),
  };
}

function scrollToTop() {
  if (typeof window === "undefined") return;

  window.setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, 0);
}

function normalizeRfqSourcePath(value: string | null) {
  if (!value) return null;

  try {
    const path = new URL(value, "https://local.invalid").pathname || "/";
    const stripped = getPathWithoutLanguage(path);
    return stripped === "/quote-request" ? null : stripped;
  } catch {
    return null;
  }
}

function getSourceManufacturerSlug(sourceUrl: string | null) {
  if (!sourceUrl) return null;

  const [, section, firstSlug] = getPathWithoutLanguage(sourceUrl).split("/");

  if ((section === "manufacturers" || section === "products") && firstSlug) {
    return firstSlug;
  }

  return null;
}

function createRfqId() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  const randomBytes = new Uint8Array(16);
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues) {
    throw new Error("Browser crypto API is required to create a quote request id.");
  }

  cryptoApi.getRandomValues(randomBytes);
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

  const hex = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function SmartRfqBuilder() {
  const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
  const currentLanguage = useCurrentLanguage();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;

  const sourceUrl = normalizeRfqSourcePath(searchParams.get("source_url"))
    || normalizeRfqSourcePath(typeof window !== "undefined" ? window.sessionStorage.getItem(QUOTE_REQUEST_SOURCE_URL_STORAGE_KEY) : null);
  const sourceManufacturerSlug = getSourceManufacturerSlug(sourceUrl);
  const sourceManufacturer = useMemo(() => (
    (manufacturersData as SourceManufacturer[]).find((manufacturer) => manufacturer.slug === sourceManufacturerSlug) || null
  ), [sourceManufacturerSlug]);
  const sourceManufacturerName = sourceManufacturer?.name[currentLanguage] || sourceManufacturer?.name.en || null;

  const [step, setStep] = useState(1)

  const requiresGasPhaseFraction = (fluidType: string) => fluidType === "gas_liquid";
  const resolveCustomSelectValue = (selectedValue: string, customValue: string) => {
    if (!selectedValue) return "";
    return selectedValue === "other" ? customValue.trim() : selectedValue;
  }

  const parameterValue = (value: string, label: LocalizedLabel, unit: string | null = null) => ({
    label,
    value: value.trim() || null,
    unit,
  });
  const optionParameter = (value: string, customValue: string, label: LocalizedLabel, options: Record<string, LocalizedLabel>) => {
    const resolvedValue = resolveCustomSelectValue(value, customValue);
    return {
      label,
      value: resolvedValue || null,
      optionId: value || null,
      optionLabel: value === "other" && customValue.trim()
        ? sameLocalizedLabel(customValue.trim())
        : value ? options[value] || sameLocalizedLabel(value) : null,
      unit: null,
    };
  };

  // Form Data
  const [contextData, setContextData] = useState<RqfContextData>({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    industry: "",
    customIndustry: ""
  })

  // Set default values instead of undefined
  const [specsData, setSpecsData] = useState<RfqProductSpecsData>({
    productType: "",
    customProductType: "",
    quantity: "",
    customQuantity: "",
    timeline: "",
    customTimeline: "",
    hotMediaName: "",
    hotInletFluidType: "",
    hotOutletFluidType: "",
    hotInletMassFlow: "",
    hotOutletMassFlow: "",
    hotInletVolumeFlow: "",
    hotOutletVolumeFlow: "",
    hotInletGasPhaseFraction: "",
    hotOutletGasPhaseFraction: "",
    hotIn: "",
    hotOut: "",
    hotInletDensity: "",
    hotOutletDensity: "",
    hotInletSpecificHeat: "",
    hotOutletSpecificHeat: "",
    hotInletConductivity: "",
    hotOutletConductivity: "",
    hotInletViscosity: "",
    hotOutletViscosity: "",
    coldMediaName: "",
    coldInletFluidType: "",
    coldOutletFluidType: "",
    coldInletMassFlow: "",
    coldOutletMassFlow: "",
    coldInletVolumeFlow: "",
    coldOutletVolumeFlow: "",
    coldInletGasPhaseFraction: "",
    coldOutletGasPhaseFraction: "",
    coldIn: "",
    coldOut: "",
    coldInletDensity: "",
    coldOutletDensity: "",
    coldInletSpecificHeat: "",
    coldOutletSpecificHeat: "",
    coldInletConductivity: "",
    coldOutletConductivity: "",
    coldInletViscosity: "",
    coldOutletViscosity: "",
    heatLoad: "",
    plateMaterial: "",
    customPlateMaterial: "",
    designCode: "",
    hotDesignPressure: "",
    hotTestPressure: "",
    coldDesignPressure: "",
    coldTestPressure: "",
    hotDesignTemperature: "",
    coldDesignTemperature: "",
    hotFlangeStandard: "",
    customHotFlangeStandard: "",
    coldFlangeStandard: "",
    customColdFlangeStandard: "",
    hotInletFlangeNominalDiameter: "",
    hotOutletFlangeNominalDiameter: "",
    coldInletFlangeNominalDiameter: "",
    coldOutletFlangeNominalDiameter: "",
    hotFlangeMaterial: "",
    coldFlangeMaterial: "",
    hotFlangePressureRating: "",
    coldFlangePressureRating: "",
    hotFlangeTypeSealingFace: "",
    coldFlangeTypeSealingFace: "",
    additionalNotes: ""
  })

  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isTargetingSourceManufacturer, setIsTargetingSourceManufacturer] = useState(true)
  const [email, setEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [specsMode, setSpecsMode] = useState<RfqSpecsMode>("quick")
  const [rfqFiles, setRfqFiles] = useState<File[]>([])
  const trackedRfqEvents = useRef(new Set<string>())

  useEffect(() => {
    if (isSubmitted) scrollToTop();
  }, [isSubmitted]);

  const trackRfqEvent = useCallback((eventName: string, extraParameters: Record<string, unknown> = {}) => {
    if (trackedRfqEvents.current.has(eventName)) return;

    trackedRfqEvents.current.add(eventName);
    trackEvent(eventName, {
      page_path: location.pathname,
      source_url: sourceUrl || null,
      source_manufacturer_slug: sourceManufacturerSlug || null,
      has_source_manufacturer: Boolean(sourceManufacturerSlug),
      language: currentLanguage,
      ...extraParameters,
    });
  }, [currentLanguage, location.pathname, sourceManufacturerSlug, sourceUrl]);

  useEffect(() => {
    trackRfqEvent("rfq_start");
  }, [trackRfqEvent]);

  // Validation Logic
  const canProceedToStep2 =
    contextData.firstName.trim() !== "" &&
    contextData.lastName.trim() !== "" &&
    contextData.country !== "" &&
    contextData.industry !== "" &&
    (contextData.industry !== "other" || contextData.customIndustry.trim() !== "");

  const hasSideMassFlow = (side: "hot" | "cold") => (
    specsData[`${side}InletMassFlow` as keyof RfqProductSpecsData].trim() !== "" ||
    specsData[`${side}OutletMassFlow` as keyof RfqProductSpecsData].trim() !== ""
  );

  const hasValidSideFluidTypes = (side: "hot" | "cold") => {
    const inletFluidType = specsData[`${side}InletFluidType` as keyof RfqProductSpecsData];

    return inletFluidType !== "";
  };

  const hasRequiredGasFraction = (side: "hot" | "cold") => {
    const inletFluidType = specsData[`${side}InletFluidType` as keyof RfqProductSpecsData];
    const outletFluidType = specsData[`${side}OutletFluidType` as keyof RfqProductSpecsData];
    const inletGasPhaseFraction = specsData[`${side}InletGasPhaseFraction` as keyof RfqProductSpecsData];
    const outletGasPhaseFraction = specsData[`${side}OutletGasPhaseFraction` as keyof RfqProductSpecsData];

    return (!requiresGasPhaseFraction(inletFluidType) || inletGasPhaseFraction.trim() !== "") &&
      (!requiresGasPhaseFraction(outletFluidType) || outletGasPhaseFraction.trim() !== "");
  };

  const canProceedWithQuickSpecs =
    specsData.productType !== "" &&
    (specsData.productType !== "other" || specsData.customProductType.trim() !== "") &&
    specsData.additionalNotes.trim() !== "";

  const canProceedToStep3 =
    specsMode === "quick"
      ? canProceedWithQuickSpecs
      : hasValidSideFluidTypes("hot") &&
    hasValidSideFluidTypes("cold") &&
    hasSideMassFlow("hot") &&
    hasSideMassFlow("cold") &&
    hasRequiredGasFraction("hot") &&
    hasRequiredGasFraction("cold") &&
    specsData.heatLoad.trim() !== "" &&
    specsData.plateMaterial !== "" &&
    (specsData.plateMaterial !== "other" || specsData.customPlateMaterial.trim() !== "") &&
    specsData.hotFlangeStandard !== "" &&
    (specsData.hotFlangeStandard !== "other" || specsData.customHotFlangeStandard.trim() !== "") &&
    specsData.coldFlangeStandard !== "" &&
    (specsData.coldFlangeStandard !== "other" || specsData.customColdFlangeStandard.trim() !== "");

  const getSpecValue = (field: keyof RfqProductSpecsData) => specsData[field] || "";
  const getEndpointValue = (side: "hot" | "cold", endpoint: "inlet" | "outlet", suffix: string) => {
    const field = `${side}${endpoint === "inlet" ? "Inlet" : "Outlet"}${suffix}` as keyof RfqProductSpecsData;
    const value = getSpecValue(field);
    if (endpoint === "inlet" || value.trim() !== "") return value;

    const copyableSuffixes = ["FluidType", "MassFlow", "VolumeFlow", "GasPhaseFraction", "Density", "SpecificHeat", "Conductivity", "Viscosity"];
    if (!copyableSuffixes.includes(suffix)) return value;

    return getSpecValue(`${side}Inlet${suffix}` as keyof RfqProductSpecsData);
  };

  const buildEndpointPayload = (side: "hot" | "cold", endpoint: "inlet" | "outlet", payloadLabels: RfqPayloadLabels) => {
    const tempField = `${side}${endpoint === "inlet" ? "In" : "Out"}` as keyof RfqProductSpecsData;
    const inletTempField = `${side}In` as keyof RfqProductSpecsData;
    const phaseValue = getEndpointValue(side, endpoint, "FluidType");
    const temperatureValue = endpoint === "outlet" && !specsData[tempField].trim() ? specsData[inletTempField] : specsData[tempField];

    return {
      label: endpoint === "inlet" ? getRfqParameterLabel("inlet") : getRfqParameterLabel("outlet"),
      fluidType: {
        label: getRfqParameterLabel("fluidType"),
        value: phaseValue || null,
        optionLabel: phaseValue ? payloadLabels.fluidTypeLabels[phaseValue] || sameLocalizedLabel(phaseValue) : null,
        unit: null,
      },
      massFlow: parameterValue(getEndpointValue(side, endpoint, "MassFlow"), getRfqParameterLabel("massFlow"), "kg/h"),
      volumeFlow: parameterValue(getEndpointValue(side, endpoint, "VolumeFlow"), getRfqParameterLabel("volumeFlow"), "m3/h"),
      gasPhaseFraction: parameterValue(getEndpointValue(side, endpoint, "GasPhaseFraction"), getRfqParameterLabel("gasPhaseFraction"), null),
      temperature: parameterValue(temperatureValue, getRfqParameterLabel("temperature"), "degC"),
      density: parameterValue(getEndpointValue(side, endpoint, "Density"), getRfqParameterLabel("density"), "kg/m3"),
      specificHeat: parameterValue(getEndpointValue(side, endpoint, "SpecificHeat"), getRfqParameterLabel("specificHeat"), "kJ/kg.degC"),
      thermalConductivity: parameterValue(getEndpointValue(side, endpoint, "Conductivity"), getRfqParameterLabel("thermalConductivity"), "W/m.degC"),
      dynamicViscosity: parameterValue(getEndpointValue(side, endpoint, "Viscosity"), getRfqParameterLabel("dynamicViscosity"), "cp"),
    };
  };

  const buildThermalSidePayload = (side: "hot" | "cold", payloadLabels: RfqPayloadLabels) => ({
    label: side === "hot" ? getRfqParameterLabel("hotSide") : getRfqParameterLabel("coldSide"),
    mediaName: parameterValue(specsData[`${side}MediaName` as keyof RfqProductSpecsData], getRfqParameterLabel("mediaName"), null),
    inlet: buildEndpointPayload(side, "inlet", payloadLabels),
    outlet: buildEndpointPayload(side, "outlet", payloadLabels),
  });

  const buildEquipmentSidePayload = (side: "hot" | "cold", payloadLabels: RfqPayloadLabels) => ({
    label: side === "hot" ? getRfqParameterLabel("hotSide") : getRfqParameterLabel("coldSide"),
    mechanical: {
      designPressure: parameterValue(specsData[`${side}DesignPressure` as keyof RfqProductSpecsData], getRfqParameterLabel("designPressure"), "MPa"),
      testPressure: parameterValue(specsData[`${side}TestPressure` as keyof RfqProductSpecsData], getRfqParameterLabel("testPressure"), "MPa"),
      designTemperature: parameterValue(specsData[`${side}DesignTemperature` as keyof RfqProductSpecsData], getRfqParameterLabel("designTemperature"), "degC"),
      flangeStandard: optionParameter(
        specsData[`${side}FlangeStandard` as keyof RfqProductSpecsData],
        specsData[`custom${side === "hot" ? "Hot" : "Cold"}FlangeStandard` as keyof RfqProductSpecsData],
        getRfqParameterLabel("flangeStandard"),
        payloadLabels.flangeStandardLabels
      ),
      flangeNominalDiameter: {
        label: getRfqParameterLabel("flangeNominalDiameter"),
        unit: "mm/DN",
        inlet: parameterValue(specsData[`${side}InletFlangeNominalDiameter` as keyof RfqProductSpecsData], getRfqParameterLabel("inlet"), "mm/DN"),
        outlet: parameterValue(specsData[`${side}OutletFlangeNominalDiameter` as keyof RfqProductSpecsData], getRfqParameterLabel("outlet"), "mm/DN"),
      },
      flangeMaterial: parameterValue(specsData[`${side}FlangeMaterial` as keyof RfqProductSpecsData], getRfqParameterLabel("flangeMaterial"), null),
      flangePressureRating: parameterValue(specsData[`${side}FlangePressureRating` as keyof RfqProductSpecsData], getRfqParameterLabel("flangePressureRating"), null),
      flangeTypeSealingFace: parameterValue(specsData[`${side}FlangeTypeSealingFace` as keyof RfqProductSpecsData], getRfqParameterLabel("flangeTypeSealingFace"), null),
    },
  });

  const buildContextPayload = () => ({
    firstName: contextData.firstName,
    lastName: contextData.lastName,
    companyName: contextData.companyName || null,
    country: contextData.country || null,
    industry: contextData.industry === "other" ? contextData.customIndustry : contextData.industry,
  });

  const buildRequestPayload = (payloadLabels: RfqPayloadLabels) => ({
    productType: optionParameter(
      specsData.productType,
      specsData.customProductType,
      getRfqParameterLabel("productType"),
      payloadLabels.productTypeLabels
    ),
    quantity: optionParameter(
      specsData.quantity,
      specsData.customQuantity,
      getRfqParameterLabel("quantity"),
      payloadLabels.quantityLabels
    ),
    timeline: optionParameter(
      specsData.timeline,
      specsData.customTimeline,
      getRfqParameterLabel("timeline"),
      payloadLabels.timelineLabels
    ),
  });

  const buildAttributionPayload = () => {
    const fallbackLandingPage = typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : location.pathname;

    return getMarketingAttributionPayload(sourceUrl || null, fallbackLandingPage);
  };

  const buildAttachmentSummary = () => ({
    count: rfqFiles.length,
    files: rfqFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type || "unknown",
    })),
  });

  const buildParametersPayload = async (): Promise<RFQSubmissionData["parameters"]> => {
    await ensureRfqPayloadLabelResources();

    const payloadLabels = createRfqPayloadLabels();

    return {
      schemaVersion: "rfq_parameters_v2",
      unitSystem: "metric",
      userLanguage: currentLanguage,
      languageLabels: ["en", "zh"],
      requestMode: specsMode,
      request: buildRequestPayload(payloadLabels),
      attribution: buildAttributionPayload(),
      attachments: buildAttachmentSummary(),
      thermal: {
        label: getRfqParameterLabel("thermal"),
        hot: buildThermalSidePayload("hot", payloadLabels),
        cold: buildThermalSidePayload("cold", payloadLabels),
        heatLoad: parameterValue(specsData.heatLoad, getRfqParameterLabel("heatLoad"), "kW"),
      },
      equipment: {
        label: getRfqParameterLabel("equipment"),
        hot: buildEquipmentSidePayload("hot", payloadLabels),
        cold: buildEquipmentSidePayload("cold", payloadLabels),
        designCode: parameterValue(specsData.designCode, getRfqParameterLabel("designCode"), null),
        plateMaterial: optionParameter(specsData.plateMaterial, specsData.customPlateMaterial, getRfqParameterLabel("plateMaterial"), payloadLabels.materialLabels),
      },
    };
  };

  const recordRfqProgressEvent = (
    eventName: string,
    payload: Record<string, unknown> = {},
    rfqId: string | number | null = null,
  ) => {
    const draftId = getOrCreateRfqDraftId();
    const visitorId = getOrCreateVisitorId();

    if (!draftId || !visitorId) return;
    const attribution = buildAttributionPayload();

    void recordRFQEvent({
      draft_id: draftId,
      visitor_id: visitorId,
      event_name: eventName,
      utm_source: attribution.utm_source,
      payload: {
        attribution,
        ...payload,
      },
      rfq_id: rfqId,
    }).catch((error) => {
      console.warn("[rfq_events] Failed to record RFQ progress event:", error);
    });
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    scrollToTop();
  }

  const handleNext = async () => {
    if (step === 1 && canProceedToStep2) {
      trackRfqEvent("rfq_step1_complete", {
        country: contextData.country,
        industry: contextData.industry === "other" ? contextData.customIndustry : contextData.industry,
        has_company_name: Boolean(contextData.companyName.trim()),
      });
      recordRfqProgressEvent("rfq_step1_complete", {
        context: buildContextPayload(),
        source_manufacturer_slug: sourceManufacturerSlug || null,
      });
      goToStep(2);
    } else if (step === 2 && canProceedToStep3) {
      trackRfqEvent("rfq_step2_complete", {
        request_mode: specsMode,
        product_type: specsData.productType,
        quantity: specsData.quantity || null,
        timeline: specsData.timeline || null,
        has_additional_notes: Boolean(specsData.additionalNotes.trim()),
        plate_material: specsData.plateMaterial,
        hot_flange_standard: specsData.hotFlangeStandard,
        cold_flange_standard: specsData.coldFlangeStandard,
      });
      const parametersPayload = await buildParametersPayload();
      recordRfqProgressEvent("rfq_step2_complete", {
        ...parametersPayload,
      });
      if (isVerified) goToStep(4);
      else goToStep(3);
    } else if (step === 3 && isVerified) {
      goToStep(4);
    }
  }

  const handleBack = () => {
    if (step > 1) goToStep(step - 1);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Determine business email logic
    const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "qq.com", "163.com", "126.com", "foxmail.com", "icloud.com"];
    const emailDomain = email.split("@")[1]?.toLowerCase() || "";
    const isBusinessEmail = !freeDomains.includes(emailDomain);

    const rfqId = createRfqId();
    const parametersPayload = await buildParametersPayload();
    const submissionPayload: RFQSubmissionData = {
      id: rfqId,
      first_name: contextData.firstName,
      last_name: contextData.lastName,
      company_name: contextData.companyName || null,
      country: contextData.country,
      email: email.toLowerCase(),
      is_business_email: isBusinessEmail,
      industry: contextData.industry === "other" ? contextData.customIndustry : contextData.industry,
      additional_notes: specsData.additionalNotes || null,
      is_stealth: isAnonymous,
      source_url: sourceUrl || null,
      is_targeting_source_manufacturer: Boolean(sourceManufacturer && isTargetingSourceManufacturer),
      parameters: parametersPayload
    }

    try {
      const submittedRFQ = await submitRFQ(submissionPayload);
      const uploadedFiles = submittedRFQ.id ? await uploadRFQFiles(submittedRFQ.id, rfqFiles) : [];

      trackRfqEvent("rfq_submit", {
        request_mode: specsMode,
        product_type: specsData.productType,
        country: contextData.country,
        industry: contextData.industry === "other" ? contextData.customIndustry : contextData.industry,
        is_business_email: isBusinessEmail,
        has_company_name: Boolean(contextData.companyName.trim()),
        is_targeting_source_manufacturer: Boolean(sourceManufacturer && isTargetingSourceManufacturer),
        attachment_count: rfqFiles.length,
        uploaded_attachment_count: uploadedFiles.length,
      });
      recordRfqProgressEvent("rfq_submit", {
        ...submissionPayload.parameters,
      }, submittedRFQ.id);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(QUOTE_REQUEST_SOURCE_URL_STORAGE_KEY);
      }
      clearRfqDraftId();
      setIsSubmitted(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to submit quote request: ", error);
      alert(`Failed to submit quote request: ${message}. Please check your data or try again later.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SeoHead
        title={t("title")}
        description={t("description")}
        keywords={t("meta.keywords", { defaultValue: "" })}
        canonicalUrl={currentUrl}
        ogTitle={t("og.title", { defaultValue: t("title") })}
        ogDescription={t("og.description", { defaultValue: t("description") })}
        siteName={siteName}
      />

      <main className="min-h-[80vh] bg-slate-50 text-foreground pb-24">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <span className="font-bold text-lg text-slate-900">{t("navbarTitle")}</span>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl pt-8">
          <div className="mx-auto mb-6 max-w-3xl text-center">
            <h1 className="text-2xl font-bold text-slate-950 md:text-4xl">{t("navbarTitle")}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">{t("description")}</p>
          </div>

          <ProgressTracker currentStep={step} />

          <div className="mt-8">

            {step === 1 && (
              <section>
                <div className="mx-auto mb-6 max-w-2xl text-center">
                  <h2 className="text-xl font-bold text-slate-900 md:text-3xl">{t("step1.title")}</h2>
                  <p className="mt-2 text-sm text-slate-500 md:text-base">{t("step1.subtitle")}</p>
                </div>
                <ContextStep
                  data={contextData}
                  onChange={(newData) => setContextData(prev => ({ ...prev, ...newData }))}
                />
              </section>
            )}

            {step === 2 && (
              <section>
                <div className="mx-auto mb-6 max-w-2xl text-center">
                  <h2 className="text-xl font-bold text-slate-900 md:text-3xl">{t("step2.title")}</h2>
                  <p className="mt-2 text-sm text-slate-500 md:text-base">{t("step2.subtitle")}</p>
                </div>
                <ProductAndSpecsStep
                  data={specsData}
                  mode={specsMode}
                  files={rfqFiles}
                  onChange={(newData) => setSpecsData(prev => ({ ...prev, ...newData }))}
                  onFilesChange={setRfqFiles}
                  onModeChange={(mode) => {
                    setSpecsMode(mode);
                    trackRfqEvent(`rfq_${mode}_mode_selected`);
                  }}
                />
              </section>
            )}

            {step === 3 && (
              <section>
                <div className="mx-auto mb-6 max-w-2xl text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t("step3.title")}</h2>
                  <p className="mt-2 text-slate-500">{t("step3.subtitle")}</p>
                </div>

                <EmailVerificationStep
                  email={email}
                  setEmail={setEmail}
                  isVerified={isVerified}
                  onNext={() => goToStep(4)}
                  onVerify={() => {
                    trackRfqEvent("rfq_email_verified", {
                      email_domain_type: email.includes("@") && !email.split("@")[1]?.toLowerCase().match(/^(gmail|yahoo|hotmail|outlook|qq|163|126|foxmail|icloud)\.com$/)
                        ? "business"
                        : "free_or_unknown",
                    });
                    setIsVerified(true);
                    goToStep(4);
                  }}
                />
              </section>
            )}

            {step === 4 && !isSubmitted && (
              <section>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t("step4.title")}</h2>
                  <p className="text-slate-500 mt-2">{t("step4.subtitle")}</p>
                </div>
                <FinalConfirmStep
                  context={contextData}
                  specs={specsData}
                  specsMode={specsMode}
                  attachments={rfqFiles}
                  email={email}
                  isAnonymous={isAnonymous}
                  sourceManufacturerName={sourceManufacturerName}
                  isTargetingSourceManufacturer={isTargetingSourceManufacturer}
                  onToggleAnonymous={() => setIsAnonymous(!isAnonymous)}
                  onToggleTargetingSourceManufacturer={() => setIsTargetingSourceManufacturer(!isTargetingSourceManufacturer)}
                  onEditStep={(s) => goToStep(s)}
                />

                <div className="mt-12 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full max-w-md h-14 text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-sm shadow-lg shadow-primary/20"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "..." : t("step4.submitBtn")}
                  </Button>
                </div>
              </section>
            )}

            {isSubmitted && (
              <section className="text-center py-20 max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-sm flex items-center justify-center mx-auto mb-8 border-[6px] border-green-50">
                  <Check className="w-12 h-12 text-green-600 stroke-[3]" />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                  {t("success.title")}
                </h2>
                <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
                  {t("success.desc")}
                </p>
                <Button className="px-8 h-12 rounded-sm bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20" onClick={() => window.location.href = "/"}>
                  {t("success.homeBtn")}
                </Button>
              </section>
            )}

          </div>
        </div>

        {/* Floating Action Footer */}
        {(!isSubmitted && step < 4) && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-bottom-bar z-50">
            <div className="container mx-auto max-w-4xl flex items-center justify-between">

              <div className="flex items-center gap-4">
                {step > 1 ? (
                  <Button variant="outline" className="border-slate-200 text-slate-600 font-bold px-6 h-12 rounded-sm" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t("actions.back")}
                  </Button>
                ) : (
                  <div className="w-24"></div>
                )}
              </div>

              {step < 3 && (
                <div className="flex items-center gap-4">
                  <Button
                    className={`h-12 rounded-sm px-10 font-bold shadow-lg transition-all ${(step === 1 && !canProceedToStep2) || (step === 2 && !canProceedToStep3)
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                      }`}
                    onClick={handleNext}
                    disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
                  >
                    {t("actions.continue")} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
