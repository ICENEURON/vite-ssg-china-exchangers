<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="text" encoding="UTF-8" />

  <xsl:template match="/">
    <xsl:text>&lt;?xml version="1.0" encoding="UTF-8"?&gt;&#10;</xsl:text>
    <xsl:text>&lt;urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"&gt;&#10;</xsl:text>
    <xsl:for-each select="sitemap:urlset/sitemap:url">
      <xsl:text>  &lt;url&gt;&#10;</xsl:text>
      <xsl:text>    &lt;loc&gt;</xsl:text><xsl:value-of select="sitemap:loc" /><xsl:text>&lt;/loc&gt;&#10;</xsl:text>
      <xsl:for-each select="xhtml:link">
        <xsl:text>    &lt;xhtml:link rel="alternate" hreflang="</xsl:text><xsl:value-of select="@hreflang" /><xsl:text>" href="</xsl:text><xsl:value-of select="@href" /><xsl:text>" /&gt;&#10;</xsl:text>
      </xsl:for-each>
      <xsl:text>    &lt;lastmod&gt;</xsl:text><xsl:value-of select="sitemap:lastmod" /><xsl:text>&lt;/lastmod&gt;&#10;</xsl:text>
      <xsl:text>    &lt;changefreq&gt;</xsl:text><xsl:value-of select="sitemap:changefreq" /><xsl:text>&lt;/changefreq&gt;&#10;</xsl:text>
      <xsl:text>    &lt;priority&gt;</xsl:text><xsl:value-of select="sitemap:priority" /><xsl:text>&lt;/priority&gt;&#10;</xsl:text>
      <xsl:text>  &lt;/url&gt;&#10;</xsl:text>
    </xsl:for-each>
    <xsl:text>&lt;/urlset&gt;&#10;</xsl:text>
  </xsl:template>
</xsl:stylesheet>