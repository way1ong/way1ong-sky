// The stories of the constellations: which constellations have one and which articles of Wikipedia each was
// written after. The texts are in the dictionaries (`sky.story.about`); the sentences they rest on —
// docs/CONSTELLATIONS.md. The stories are under the articles' licence, CC BY-SA 4.0 (the owner's decision
// of 25.11): each card links to its articles and names the licence.
import file from '../data/constellation-stories.json';

export interface StoryPage {
  url: string;
  /** The revision of the article that was read. */
  revision: number;
}

export interface Story {
  /** Who put the constellation on the list, by the table of Wikipedia's list of the 88: a key of the dictionary. */
  listed: 'ptolemy';
  /** The articles the story was written after, by language. */
  pages: Partial<Record<'en' | 'uk' | 'hu', StoryPage>>;
}

export const STORIES = file.stories as unknown as Readonly<Record<string, Story>>;
export const STORY_SOURCE = file.source;

/** The articles to credit under a story shown in a language: that language's own and the English one. */
export function creditPages(story: Story, lang: string): { lang: 'en' | 'uk' | 'hu'; page: StoryPage }[] {
  const order = [...new Set([lang, 'en'])] as ('en' | 'uk' | 'hu')[];
  return order.flatMap((key) => (story.pages[key] ? [{ lang: key, page: story.pages[key] as StoryPage }] : []));
}
