
// ============================================================
// FILE PATH: src/utils/seo.js
// ============================================================
export const seoUtils = {
  // Set page title
  setTitle(title, siteName = 'SARSAR') {
    document.title = title ? `${title} | ${siteName}` : siteName;
  },

  // Set meta description
  setDescription(description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  },

  // Set Open Graph tags
  setOGTags({ title, description, image, url }) {
    const tags = {
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': url,
    };

    Object.entries(tags).forEach(([property, content]) => {
      if (content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      }
    });
  },

  // Set canonical URL
  setCanonical(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  },

  // Update all SEO tags
  updatePageSEO({ title, description, image, url, keywords }) {
    this.setTitle(title);
    this.setDescription(description);
    this.setOGTags({ title, description, image, url });
    this.setCanonical(url);

    if (keywords) {
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'keywords';
        document.head.appendChild(meta);
      }
      meta.content = keywords;
    }
  },
};

export default seoUtils;
