export type Localized<T> = { ar: T; en: T };

export type NewsItem = {
  slug: string;
  date: string;
  image: string;
  imageAlt: Localized<string>;
  title: Localized<string>;
  summary: Localized<string>;
  body: Localized<string[]>;
};
