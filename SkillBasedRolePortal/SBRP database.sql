-- Create the SBRP database if it doesn't exist
CREATE DATABASE IF NOT EXISTS SBRP;

-- Switch to the SBRP database
USE SBRP;

DROP TABLE IF EXISTS `ROLE_APPLICATIONS`;
DROP TABLE IF EXISTS `ROLE_LISTINGS`;

DROP TABLE IF EXISTS STAFF_REPORTING_OFFICER;
-- Create the STAFF_DETAILS table
DROP TABLE IF EXISTS STAFF_DETAILS;
CREATE TABLE STAFF_DETAILS (
    staff_id INT PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    dept VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(20),
    biz_address VARCHAR(255),
    sys_role ENUM('staff', 'hr', 'manager', 'inactive')
);

-- Create the STAFF_REPORTING_OFFICER table
CREATE TABLE  STAFF_REPORTING_OFFICER (
    staff_id INT,
    RO_id INT,
    FOREIGN KEY (RO_id) REFERENCES STAFF_DETAILS(staff_id)
);

-- Create the STAFF_ROLES table
DROP TABLE IF EXISTS STAFF_ROLES;
DROP TABLE IF EXISTS ROLE_DETAILS;
-- Create the ROLE_DETAILS table
CREATE TABLE ROLE_DETAILS (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(50),
    role_description VARCHAR(50000),
    role_status ENUM('active', 'inactive')
);

CREATE TABLE STAFF_ROLES (
    staff_id INT,
    staff_role INT,
    role_type ENUM('primary', 'secondary'),
    sr_status ENUM('active', 'inactive'),
    FOREIGN KEY (staff_role) REFERENCES ROLE_DETAILS(role_id)
);

-- Create the SKILL_DETAILS table
DROP TABLE IF EXISTS SKILL_DETAILS;
CREATE TABLE SKILL_DETAILS (
    skill_id INT PRIMARY KEY,
    skill_name VARCHAR(50),
    skill_status ENUM('active', 'inactive')
);

-- Create the STAFF_SKILLS table
DROP TABLE IF EXISTS STAFF_SKILLS;
CREATE TABLE STAFF_SKILLS (
    staff_id INT,
    skill_id INT,
    ss_status ENUM('active', 'unverified', 'in-progress')
);

-- Create the ROLE_SKILLS table
DROP TABLE IF EXISTS ROLE_SKILLS;
CREATE TABLE ROLE_SKILLS (
    role_id INT,
    skill_id INT
);

-- Insert sample data into the STAFF_DETAILS table
INSERT INTO STAFF_DETAILS (staff_id, fname, lname, dept, email, phone, biz_address, sys_role)
VALUES
    (123456789, 'AH GAO', 'TAN', 'FINANCE', 'tan_ah_gao@all-in-one.com.sg', '65-1234-5678', '60 Paya Lebar Rd, #06-33 Paya Lebar Square, Singapore 409051', 'staff'),
    (123456788, 'VINCENT REX', 'COLINS', 'HUMAN RESOURCE AND ADMIN', 'colins_vincent_rex@all-in-one.com.sg', '65-1234-5679', '60 Paya Lebar Rd, #06-33 Paya Lebar Square, Singapore 409051', 'hr'),
    (123456787, 'FAUD', 'NIZAM', 'SALES', 'faud_nizam@all-in-one.com.sg', '60-03-21345678', 'Unit 3A-07, Tower A, The Vertical Business Suite, 8, Jalan Kerinchi, Bangsar South, 59200 Kuala Lumpur, Malaysia', 'manager'),
    (123456786, 'JOHN', 'DOE', 'IT', 'John_doe@all-in-one.com.sg', '65-5824-7888', '1 Scotts Rd, #24-10 Shaw Centre, Singapore 228208', 'inactive');

-- Insert sample data into the STAFF_REPORTING_OFFICER table
INSERT INTO STAFF_REPORTING_OFFICER (staff_id, RO_id)
VALUES
    (123456789, 123456787),
    (123456788, 123456787);
    
-- Insert sample data into the ROLE_DETAILS table
INSERT INTO ROLE_DETAILS (role_id, role_name, role_description, role_status)
VALUES
    (234567891, 'Head, Talent Attraction', "The Head, Talent Attraction is responsible for strategic workforce planning to support the organisation's growth strategies through establishing talent sourcing strategies, determining the philosophy for the
selection and securing of candidates and overseeing the onboarding and integration of new hires into the organisation. He/She develops various approaches to meet workforce requirements and designs
employer branding strategies. He oversees the selection processes and collaborates with business stakeholders for the hiring of key leadership roles. As a department head, he is responsible for setting the
direction and articulating goals and objectives for the team, and driving the integration of Skills Frameworks across the organisation's talent attraction plans.
The Head, Talent Attraction is an influential and inspiring leader who adopts a broad perspective in the decisions he makes. He is articulate and displays a genuine passion for motivating and developing his
team", 'inactive'),
    (234567892, 'Learning Facilitator / Trainer', "The Learning Facilitator delivers learning products and services in a variety of environments, using multiple learning delivery modes and methods. He/She assesses learning needs and adapts the facilitation
approach to reflect desired learning outcomes and learner needs. He is responsible for knowledge and skills transfer by delivering learning content, facilitating group discussions and responding to queries.
He drives learner development and commitment to continuous learning by actively providing feedback and learner support. He evaluates curriculum effectiveness and recommends improvement areas by
collecting learner feedback as well as analysing learning delivery approaches and materials.
He is a strong communicator who builds trusted relationships and creates a cooperative and engaging learning environment. He is adaptable and adept at managing multiple stakeholders.
He works in multiple different environments, including different learning venues and client sites, and regularly interacts with digital systems.", 'active'),
    (234567893, 'Agile Coach (SM)', "The Agile Coach (SM) coaches teams in the conduct of Agile practices and the implementation of Agile methodologies and practices in the organisation and acts as an effective Scrum Master in Agile Scrum
teams.", 'active'),
	(234511581, 'Fire Warden', "The Fire Warden is responsible for testing fire alarms and firefighting equipment and implementing risk assessment recommendations. In the event of a confirmed fire alarm or fire drill, the warden assists
in the safe evacuation of staff and visitors from the premise immediately.", 'active');

-- Insert sample data into the STAFF_ROLES table
INSERT INTO STAFF_ROLES (staff_id, staff_role, role_type, sr_status)
VALUES
    (123456789, 234567891, 'primary', 'active'),
    (123456789, 234567893, 'secondary', 'active'),
    (123456789, 234511581, 'secondary', 'inactive');

-- Insert sample data into the SKILL_DETAILS table
INSERT INTO SKILL_DETAILS (skill_id, skill_name, skill_status)
VALUES
    (345678912, 'Pascal Programming', 'inactive'),
    (345678913, 'Python Programming', 'active'),
    (345678914, 'Certified Scrum Master', 'active');

-- Insert sample data into the STAFF_SKILLS table
INSERT INTO STAFF_SKILLS (staff_id, skill_id, ss_status)
VALUES
    (123456789, 345678913, 'active'),
    (123456789, 345678866, 'active'),
    (123456789, 345678790, 'active'),
    (123456789, 345678890, 'unverified'),
    (123456789, 345678935, 'in-progress'),
    (123456789, 345678927, 'in-progress');

-- Insert sample data into the ROLE_SKILLS table
INSERT INTO ROLE_SKILLS (role_id, skill_id)
VALUES
    (234567893, 345678914),
    (234567899, 345678915),
    (234567899, 345678916);

-- Revoke privileges for INSERT, UPDATE, DELETE
-- REVOKE INSERT, UPDATE, DELETE ON SBRP.STAFF_DETAILS FROM PUBLIC;
-- REVOKE INSERT, UPDATE, DELETE ON SBRP.STAFF_REPORTING_OFFICER FROM PUBLIC;
-- REVOKE INSERT, UPDATE, DELETE ON SBRP.STAFF_ROLES FROM PUBLIC;
-- REVOKE INSERT, UPDATE, DELETE ON SBRP.ROLE_DETAILS FROM PUBLIC;
-- REVOKE INSERT, UPDATE, DELETE ON SBRP.SKILL_DETAILS FROM PUBLIC;
-- REVOKE INSERT, UPDATE, DELETE ON SBRP.STAFF_SKILLS FROM PUBLIC;
-- REVOKE INSERT, UPDATE, DELETE ON SBRP.ROLE_SKILL FROM PUBLIC;

CREATE TABLE `ROLE_LISTINGS` (
  `role_listing_id` int NOT NULL,
  `role_id` int NOT NULL,
  `role_listing_desc` varchar(50000) DEFAULT NULL,
  `role_listing_source` int NOT NULL,
  `role_listing_open` datetime NOT NULL,
  `role_listing_close` datetime NOT NULL,
  `role_listing_creator` int NOT NULL,
  `role_listing_ts_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role_listing_updater` int NOT NULL,
  `role_listing_ts_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_listing_id`),
  UNIQUE KEY `role_listing_id_UNIQUE` (`role_listing_id`),
  KEY `role_id_idx` (`role_id`),
  KEY `role_listing_creator_idx` (`role_listing_source`),
  KEY `role_listing_updater_idx` (`role_listing_updater`),
  KEY `role_listing_creator_idx1` (`role_listing_creator`),
  CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `ROLE_DETAILS` (`role_id`),
  CONSTRAINT `role_listing_creator` FOREIGN KEY (`role_listing_creator`) REFERENCES `STAFF_DETAILS` (`staff_id`),
  CONSTRAINT `role_listing_source` FOREIGN KEY (`role_listing_source`) REFERENCES `STAFF_DETAILS` (`staff_id`),
  CONSTRAINT `role_listing_updater` FOREIGN KEY (`role_listing_updater`) REFERENCES `STAFF_DETAILS` (`staff_id`)
);

CREATE TABLE `ROLE_APPLICATIONS` (
  `role_app_id` int NOT NULL,
  `role_listing_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `role_app_status` enum('draft','applied','withdrawn') NOT NULL,
  `role_app_ts_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_app_id`),
  UNIQUE KEY `role_app_id_UNIQUE` (`role_app_id`),
  KEY `role_listing_id_idx` (`role_listing_id`),
  KEY `staff_id_idx` (`staff_id`),
  CONSTRAINT `role_listing_id` FOREIGN KEY (`role_listing_id`) REFERENCES `ROLE_LISTINGS` (`role_listing_id`),
  CONSTRAINT `staff_details_id` FOREIGN KEY (`staff_id`) REFERENCES `LMS`.`STAFF_DETAILS` (`staff_id`)
);

-- Commit the changes
COMMIT;