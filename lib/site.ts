export const site = {
  name: "JR Sound",
  fullName: "JR Sound — Som e Acessórios",
  // Troque pelo número real com DDI+DDD, apenas dígitos
  whatsapp: "5532998365888",
  instagram: "https://instagram.com/jrsound_mg",
  mapsQuery: "JR Sound Som e Acessórios",
  hours: [
    { d: "Segunda a Sexta", h: "09:00 — 18:00" },
    { d: "Sábado", h: "09:00 — 13:00" },
    { d: "Domingo", h: "Fechado" },
  ],
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
