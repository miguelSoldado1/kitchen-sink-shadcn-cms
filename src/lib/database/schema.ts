import { decimal, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export * from "../auth/auth-schema";

export const product = pgTable("product", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku").unique().notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productCategory = pgTable("product_category", {
  id: serial("id").primaryKey(),
  productId: serial("product_id")
    .references(() => product.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: serial("category_id")
    .references(() => category.id, { onDelete: "cascade" })
    .notNull(),
});
