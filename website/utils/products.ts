export const monthlyPlans = [
  {
    variantId: "110545",
    size: "1GB storage",
    price: "$10",
    events: "(~819,200 pageviews)",
  },
  {
    variantId: "110555",
    size: "2GB storage",
    price: "$19",
    events: "(~1,638,400 pageviews)",
  },
  {
    variantId: "125808",
    size: "4GB storage",
    price: "$36",
    events: "(~3,276,800 pageviews)",
  },
  {
    variantId: "125810",
    size: "6GB storage",
    price: "$54",
    events: "(~4,915,200 pageviews)",
  },
  {
    variantId: "125811",
    size: "8GB storage",
    price: "$70.4",
    events: "(~6,553,600 pageviews)",
  },
  {
    variantId: "125812",
    size: "10GB storage",
    price: "$85",
    events: "(~8,192,000 pageviews)",
  },
  {
    variantId: "125813",
    size: "12GB storage",
    price: "$102",
    events: "(~9,830,400 pageviews)",
  },
  {
    size: "Contact us",
    price: "Let's find out",
    events: "Super duper pro",
  },
];

export const annualPlans = [
  {
    variantId: "125820",
    size: "1GB storage",
    price: "$108",
    events: "(~819,200 pageviews)",
  },
  {
    variantId: "125821",
    size: "2GB storage",
    price: "$205.2",
    events: "(~1,638,400 pageviews)",
  },
  {
    variantId: "125823",
    size: "4GB storage",
    price: "$367.2",
    events: "(~3,276,800 pageviews)",
  },
  {
    variantId: "125827",
    size: "6GB storage",
    price: "$550.8",
    events: "(~4,915,200 pageviews)",
  },
  {
    variantId: "125828",
    size: "8GB storage",
    price: "$718.08",
    events: "(~6,553,600 pageviews)",
  },
  {
    variantId: "125829",
    size: "10GB storage",
    price: "$867",
    events: "(~8,192,000 pageviews)",
  },
  {
    variantId: "125830",
    size: "12GB storage",
    price: "$1040.4",
    events: "(~9,830,400 pageviews)",
  },
  {
    size: "Contact us",
    price: "Let's find out",
    events: "Super duper pro",
  },
];

export const allPlans = [...monthlyPlans, ...annualPlans];

export function getPlanById(id: string) {
  return allPlans.find((plan) => plan.variantId === id);
}
