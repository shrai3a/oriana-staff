CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`attendanceNotifications` boolean NOT NULL DEFAULT true,
	`warningNotifications` boolean NOT NULL DEFAULT true,
	`salaryNotifications` boolean NOT NULL DEFAULT true,
	`leaveNotifications` boolean NOT NULL DEFAULT true,
	`gpsAlertNotifications` boolean NOT NULL DEFAULT true,
	`inAppNotifications` boolean NOT NULL DEFAULT true,
	`emailNotifications` boolean NOT NULL DEFAULT false,
	`smsNotifications` boolean NOT NULL DEFAULT false,
	`pushNotifications` boolean NOT NULL DEFAULT true,
	`quietHoursEnabled` boolean NOT NULL DEFAULT false,
	`quietHoursStart` varchar(5),
	`quietHoursEnd` varchar(5),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeId` int,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('attendance','warning','salary','leave','system','gps_alert','buddy_punch') NOT NULL DEFAULT 'system',
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`relatedId` int,
	`relatedType` varchar(50),
	`data` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
