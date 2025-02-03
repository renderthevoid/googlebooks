import { books_v1 } from "@types/gapi.client.books";

declare global {
  type Book = books_v1.Schema$Volume;
  type BookList = books_v1.Schema$Volumes;
}

export {};