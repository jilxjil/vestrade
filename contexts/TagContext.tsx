import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const TAGS_KEY = 'user_tags';

type TagContextType = {
  tags: string[];
  addTag: (tag: string) => Promise<void>;
  editTag: (oldTag: string, newTag: string) => Promise<void>;
  deleteTag: (tag: string) => Promise<void>;
  refreshTags: () => Promise<void>;
};

const TagContext = createContext<TagContextType | undefined>(undefined);

export const TagProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    refreshTags();
  }, []);

  const refreshTags = async () => {
    const stored = await AsyncStorage.getItem(TAGS_KEY);
    if (stored) {
      setTags(JSON.parse(stored));
    } else {
      setTags(['SRS', 'News']); // Default tags
    }
  };

  const saveTags = async (newTags: string[]) => {
    setTags(newTags);
    await AsyncStorage.setItem(TAGS_KEY, JSON.stringify(newTags));
  };

  const addTag = async (tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      await saveTags(newTags);
    }
  };

  const editTag = async (oldTag: string, newTag: string) => {
    const newTags = tags.map(t => (t === oldTag ? newTag : t));
    await saveTags(newTags);
  };

  const deleteTag = async (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    await saveTags(newTags);
  };

  return (
    <TagContext.Provider value={{ tags, addTag, editTag, deleteTag, refreshTags }}>
      {children}
    </TagContext.Provider>
  );
};

export const useTags = () => {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error('useTags must be used within a TagProvider');
  return ctx;
}; 