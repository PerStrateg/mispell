export interface EnglishPluralAdapter {
  getPluralCategory?(count: number): string;
  formatCount?(count: number, forms: Record<string, string>): string;
}

export function createEnglishPluralAdapter(
  plural?: EnglishPluralAdapter
): Required<EnglishPluralAdapter> {
  const rules = new Intl.PluralRules("en");

  return {
    getPluralCategory: (count) => plural?.getPluralCategory?.(count) ?? rules.select(count),
    formatCount: (count, forms) => {
      if (plural?.formatCount) {
        return plural.formatCount(count, forms);
      }

      const category = plural?.getPluralCategory?.(count) ?? rules.select(count);
      return forms[category] ?? forms.other ?? Object.values(forms)[0] ?? String(count);
    }
  };
}
