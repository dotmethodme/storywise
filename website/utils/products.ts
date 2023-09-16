export const monthlyPlans = [
  {
    variantId: "110545",
    slug: "7daa5e4a-8ee3-467f-b2c2-82204915eb83",
    size: "1GB storage",
    price: "$10",
    events: "(~819,200 pageviews)",
    type: "monthly",
  },
  {
    variantId: "110555",
    slug: "0f5b1b4c-1e50-4d56-aeb1-4aa2ec39a1e0",
    size: "2GB storage",
    price: "$19",
    events: "(~1,638,400 pageviews)",
    type: "monthly",
  },
  {
    variantId: "125808",
    slug: "d7850228-f3c6-4ada-9f0e-4d7ba170b1c0",
    size: "4GB storage",
    price: "$36",
    events: "(~3,276,800 pageviews)",
    type: "monthly",
  },
  {
    variantId: "125810",
    slug: "58477ec1-d080-4df4-b842-9db20855ca86",
    size: "6GB storage",
    price: "$54",
    events: "(~4,915,200 pageviews)",
    type: "monthly",
  },
  {
    variantId: "125811",
    slug: "e03f617c-30cc-41b9-9deb-b75d5eb128e6",
    size: "8GB storage",
    price: "$70.4",
    events: "(~6,553,600 pageviews)",
    type: "monthly",
  },
  {
    variantId: "125812",
    slug: "197ae190-43a4-4b78-a695-238e46dfd792",
    size: "10GB storage",
    price: "$85",
    events: "(~8,192,000 pageviews)",
    type: "monthly",
  },
  {
    variantId: "125813",
    slug: "0f45fa6d-34ab-450f-9432-38ea81aae39a",
    size: "12GB storage",
    price: "$102",
    events: "(~9,830,400 pageviews)",
    type: "monthly",
  },
  {
    size: "Contact us",
    price: "Let's find out",
    events: "Super duper pro",
    type: "monthly",
  },
];

export const annualPlans = [
  {
    variantId: "125820",
    slug: "b3ba5e9f-14fa-493e-b98a-296d7cd923f6",
    size: "1GB storage",
    price: "$108",
    events: "(~819,200 pageviews)",
    type: "annually",
  },
  {
    variantId: "125821",
    slug: "a49d3210-bce5-419d-b88e-be83b946b3b4",
    size: "2GB storage",
    price: "$205.2",
    events: "(~1,638,400 pageviews)",
    type: "annually",
  },
  {
    variantId: "125823",
    slug: "9f15fefb-7427-43a1-95f1-77ae7fc9ef2a",
    size: "4GB storage",
    price: "$367.2",
    events: "(~3,276,800 pageviews)",
    type: "annually",
  },
  {
    variantId: "125827",
    slug: "84e0e1e8-b80f-4982-aa75-f951a28a4c93",
    size: "6GB storage",
    price: "$550.8",
    events: "(~4,915,200 pageviews)",
    type: "annually",
  },
  {
    variantId: "125828",
    slug: "4f77dba0-ef10-49c3-9d05-3883d415a574",
    size: "8GB storage",
    price: "$718.08",
    events: "(~6,553,600 pageviews)",
    type: "annually",
  },
  {
    variantId: "125829",
    slug: "6017db4e-21af-4d82-af7a-7f248a00a890",
    size: "10GB storage",
    price: "$867",
    events: "(~8,192,000 pageviews)",
    type: "annually",
  },
  {
    variantId: "125830",
    slug: "7c3e22a5-d250-466f-aa8c-4aece0bab209",
    size: "12GB storage",
    price: "$1040.4",
    events: "(~9,830,400 pageviews)",
    type: "annually",
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

export function generateUrlByVariantId(
  variantId: string,
  email: string,
  profileId: string
): string | undefined {
  const plan = getPlanById(variantId);
  if (!plan) return;

  const otherVariants = allPlans
    .filter((p) => p.variantId !== variantId)
    .map((x) => x.variantId)
    .join(",");
  const url = new URL(`https://storywise.lemonsqueezy.com/checkout/buy/${plan.slug}`);
  url.searchParams.append("disabled", otherVariants);
  url.searchParams.set("checkout[email]", email);
  url.searchParams.set("checkout[custom][user_id]", profileId);
  url.searchParams.set("redirect_url", window.location.origin + "/admin");

  return url.toString();
}
