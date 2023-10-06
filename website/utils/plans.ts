const config = useRuntimeConfig();

export const monthlyPlans = [
  {
    variantId: config.public.PLAN_MONTHLY_1GB,
    slug: config.public.PLAN_MONTHLY_1GB_SLUG,
    size: "1GB storage",
    sizeBytes: 1073741824,
    price: "$10",
    events: "(~1 million events)",
    type: "monthly",
  },
  {
    variantId: config.public.PLAN_MONTHLY_2GB,
    slug: config.public.PLAN_MONTHLY_2GB_SLUG,
    size: "2GB storage",
    sizeBytes: 2147483648,
    price: "$19",
    events: "(~2 million events)",
    type: "monthly",
  },
  {
    variantId: config.public.PLAN_MONTHLY_4GB,
    slug: config.public.PLAN_MONTHLY_4GB_SLUG,
    size: "4GB storage",
    sizeBytes: 4294967296,
    price: "$36",
    events: "(~4 million events)",
    type: "monthly",
  },
  {
    variantId: config.public.PLAN_MONTHLY_6GB,
    slug: config.public.PLAN_MONTHLY_6GB_SLUG,
    size: "6GB storage",
    sizeBytes: 6442450944,
    price: "$54",
    events: "(~6 million events)",
    type: "monthly",
  },
  {
    variantId: config.public.PLAN_MONTHLY_8GB,
    slug: config.public.PLAN_MONTHLY_8GB_SLUG,
    size: "8GB storage",
    sizeBytes: 8589934592,
    price: "$70.4",
    events: "(~8 million events)",
    type: "monthly",
  },
  {
    variantId: config.public.PLAN_MONTHLY_10GB,
    slug: config.public.PLAN_MONTHLY_10GB_SLUG,
    size: "10GB storage",
    sizeBytes: 10737418240,
    price: "$85",
    events: "(~10 million events)",
    type: "monthly",
  },
  {
    variantId: config.public.PLAN_MONTHLY_12GB,
    slug: config.public.PLAN_MONTHLY_12GB_SLUG,
    size: "12GB storage",
    sizeBytes: 12884901888,
    price: "$102",
    events: "(~12 million events)",
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
    variantId: config.public.PLAN_YEARLY_1GB,
    slug: config.public.PLAN_YEARLY_1GB_SLUG,
    size: "1GB storage",
    sizeBytes: 1073741824,
    price: "$108",
    events: "(~1 million events)",
    type: "annually",
  },
  {
    variantId: config.public.PLAN_YEARLY_2GB,
    slug: config.public.PLAN_YEARLY_2GB_SLUG,
    size: "2GB storage",
    sizeBytes: 2147483648,
    price: "$205.2",
    events: "(~2 million events)",
    type: "annually",
  },
  {
    variantId: config.public.PLAN_YEARLY_4GB,
    slug: config.public.PLAN_YEARLY_4GB_SLUG,
    size: "4GB storage",
    sizeBytes: 4294967296,
    price: "$367.2",
    events: "(~4 million events)",
    type: "annually",
  },
  {
    variantId: config.public.PLAN_YEARLY_6GB,
    slug: config.public.PLAN_YEARLY_6GB_SLUG,
    size: "6GB storage",
    sizeBytes: 6442450944,
    price: "$550.8",
    events: "(~6 million events)",
    type: "annually",
  },
  {
    variantId: config.public.PLAN_YEARLY_8GB,
    slug: config.public.PLAN_YEARLY_8GB_SLUG,
    size: "8GB storage",
    sizeBytes: 8589934592,
    price: "$718.08",
    events: "(~8 million events)",
    type: "annually",
  },
  {
    variantId: config.public.PLAN_YEARLY_10GB,
    slug: config.public.PLAN_YEARLY_10GB_SLUG,
    size: "10GB storage",
    sizeBytes: 10737418240,
    price: "$867",
    events: "(~10 million events)",
    type: "annually",
  },
  {
    variantId: config.public.PLAN_YEARLY_12GB,
    slug: config.public.PLAN_YEARLY_12GB_SLUG,
    size: "12GB storage",
    sizeBytes: 12884901888,
    price: "$1040.4",
    events: "(~12 million events)",
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
    .filter((p) => p.type !== plan.type)
    .map((x) => x.variantId)
    .join(",");

  const url = new URL(`https://storywise.lemonsqueezy.com/checkout/buy/${plan.slug}`);
  url.searchParams.append("disabled", otherVariants);
  url.searchParams.set("checkout[email]", email);
  url.searchParams.set("checkout[custom][user_id]", profileId);
  url.searchParams.set("redirect_url", window.location.origin + "/admin");

  return url.toString();
}
