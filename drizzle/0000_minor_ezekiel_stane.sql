CREATE TABLE `winners` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`name` text NOT NULL,
	`score` integer NOT NULL
);
