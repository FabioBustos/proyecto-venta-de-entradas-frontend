'use client';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function generateEventSchema(evento: {
  _id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion?: string;
  lugar?: string;
  precio: number;
  categoria: string;
  imagenUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: evento.nombre,
    description: evento.descripcion,
    startDate: evento.fecha,
    location: {
      '@type': 'Place',
      name: evento.lugar || evento.ubicacion,
      address: evento.ubicacion || evento.lugar,
    },
    image: evento.imagenUrl,
    offers: {
      '@type': 'Offer',
      price: evento.precio,
      priceCurrency: 'CLP',
      availability: 'https://schema.org/InStock',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VentaEntradas',
    url: 'https://ventaentradas.cl',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ventaentradas.cl/eventos?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VentaEntradas',
    url: 'https://ventaentradas.cl',
    logo: 'https://ventaentradas.cl/og-image.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56-9-XXXX-XXXX',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [],
  };
}
