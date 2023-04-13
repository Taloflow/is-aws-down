import fs from 'fs/promises'
import path from 'path'
import grayMatter from 'gray-matter'

export const getMDXPost = async (filename: string) => {
  const filePath = path.join("posts", filename);
  const file = await fs.readFile(filePath, "utf-8");
  const { data: frontmatter, content } = grayMatter(file);
  return {
    frontmatter,
    content,
  } as const
}