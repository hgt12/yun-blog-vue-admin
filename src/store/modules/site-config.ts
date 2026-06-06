import ConfigAPI from "@/api/system/config";

export interface SiteConfigState {
  siteName: string;
  siteIcon: string;
  navbarTitle: string;
  loginTitle: string;
  footerRemark: string;
  copyright: string;
  publicSecurityIcp: string;
  publicSecurityLink: string;
  publicSecurityIcon: string;
  publicSecurityIconEnabled: boolean;
  icp: string;
  icpLink: string;
}

//默认配置值
const DEFAULT_SITE_CONFIG: SiteConfigState = {
  siteName: "云梦泽的个人博客后台系统",
  siteIcon: "/img/comment_default_avatar.png",
  navbarTitle: "云梦泽个人博客后台管理系统",
  loginTitle: "云梦泽个人博客后台管理系统",
  footerRemark: "----备注----",
  copyright: "Copyright © 2026 云梦泽. All Rights Reserved.",
  publicSecurityIcp: "暂无公网安备",
  publicSecurityLink: "https://beian.mps.gov.cn",
  publicSecurityIcon: "/img/public_security_filing_icon.png",
  publicSecurityIconEnabled: true,
  icp: "暂无ICP备案",
  icpLink: "https://beian.miit.gov.cn",
};

//配置键
const SITE_CONFIG_KEYS = {
  siteName: "admin.site.siteName",
  siteIcon: "admin.site.siteIcon",
  navbarTitle: "admin.home.navbarTitle",
  loginTitle: "admin.login.loginTitle",
  footerRemark: "admin.footer.remarkText",
  copyright: "admin.footer.copyright",
  publicSecurityIcp: "admin.footer.publicSecurityIcp",
  publicSecurityLink: "admin.footer.publicSecurityLink",
  publicSecurityIcon: "admin.footer.publicSecurityIcon",
  publicSecurityIconEnabled: "admin.footer.publicSecurityIconEnabled",
  icp: "admin.footer.icp",
  icpLink: "admin.footer.icpLink",
} as const;

function normalizeBool(value?: string) {
  return value === "true" || value === "1";
}

function normalizeSiteConfig(
  data?: Array<{ configKey: string; configValue: string }>
): SiteConfigState {
  const configMap = (data ?? []).reduce<Record<string, string>>((acc, item) => {
    acc[item.configKey] = item.configValue;
    return acc;
  }, {});

  return {
    siteName: configMap[SITE_CONFIG_KEYS.siteName] || DEFAULT_SITE_CONFIG.siteName,
    navbarTitle: configMap[SITE_CONFIG_KEYS.navbarTitle] || DEFAULT_SITE_CONFIG.navbarTitle,
    loginTitle: configMap[SITE_CONFIG_KEYS.loginTitle] || DEFAULT_SITE_CONFIG.loginTitle,
    copyright: configMap[SITE_CONFIG_KEYS.copyright] || DEFAULT_SITE_CONFIG.copyright,
    footerRemark: configMap[SITE_CONFIG_KEYS.footerRemark] || DEFAULT_SITE_CONFIG.footerRemark,
    publicSecurityIcp:
      configMap[SITE_CONFIG_KEYS.publicSecurityIcp] || DEFAULT_SITE_CONFIG.publicSecurityIcp,
    publicSecurityLink:
      configMap[SITE_CONFIG_KEYS.publicSecurityLink] || DEFAULT_SITE_CONFIG.publicSecurityLink,
    publicSecurityIcon:
      configMap[SITE_CONFIG_KEYS.publicSecurityIcon] || DEFAULT_SITE_CONFIG.publicSecurityIcon,
    publicSecurityIconEnabled: configMap[SITE_CONFIG_KEYS.publicSecurityIconEnabled]
      ? normalizeBool(configMap[SITE_CONFIG_KEYS.publicSecurityIconEnabled])
      : DEFAULT_SITE_CONFIG.publicSecurityIconEnabled,
    icp: configMap[SITE_CONFIG_KEYS.icp] || DEFAULT_SITE_CONFIG.icp,
    icpLink: configMap[SITE_CONFIG_KEYS.icpLink] || DEFAULT_SITE_CONFIG.icpLink,
    siteIcon: configMap[SITE_CONFIG_KEYS.siteIcon] || DEFAULT_SITE_CONFIG.siteIcon,
  };
}

export const useSiteConfigStore = defineStore("site-config", () => {
  const siteConfig = ref<SiteConfigState>({ ...DEFAULT_SITE_CONFIG });
  const loaded = ref(false);

  function applyDocumentMeta() {
    document.title = siteConfig.value.siteName;

    const faviconHref =
      (document.querySelector('link[rel="icon"]') as HTMLLinkElement | null) ??
      document.createElement("link");
    faviconHref.rel = "icon";
    faviconHref.href = siteConfig.value.siteIcon || "/favicon.ico";
    if (!faviconHref.parentNode) {
      document.head.appendChild(faviconHref);
    }
  }

  async function loadSiteConfig() {
    try {
      const data = await ConfigAPI.getSiteConfig();
      siteConfig.value = normalizeSiteConfig(data);
    } catch {
      siteConfig.value = { ...DEFAULT_SITE_CONFIG };
    } finally {
      loaded.value = true;
      applyDocumentMeta();
    }
  }

  return {
    siteConfig,
    loaded,
    loadSiteConfig,
  };
});
