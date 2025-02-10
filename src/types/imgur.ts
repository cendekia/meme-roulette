export interface ImgurResponse {
  id: string;
  title: string;
  description: string;
  cover: ImgurCover;
}

export interface ImgurCover {
  id: string;
  url: string;
  width: number;
  height: number;
  type: string;
  mime_type: string;
} 