CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    wallet INT NOT NULL DEFAULT 500 CHECK (wallet >= 0),
    last_gacha_time TIMESTAMP,
    level INT NOT NULL DEFAULT 1,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS factory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    production_rate INT NOT NULL
);

CREATE TABLE IF NOT EXISTS fish (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL CHECK (price >= 0),
    rarity VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    special_ability VARCHAR(255) NOT NULL,
    pool_rate NUMERIC(5,4) NOT NULL,
    unlock_level INT NOT NULL
);


CREATE TABLE IF NOT EXISTS inventory (
    user_id INT NOT NULL,
    fish_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    PRIMARY KEY (user_id, fish_id),
    FOREIGN KEY (fish_id) REFERENCES fish(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS factory_inventory (
    user_id INT NOT NULL,
    factory_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, factory_id),
    UNIQUE (user_id, factory_id),
    FOREIGN KEY (factory_id) REFERENCES factory(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert fish data only if the table is empty
INSERT INTO fish (name, price, rarity, description, special_ability, pool_rate, unlock_level)
SELECT * FROM (
    VALUES
    ('Angelfish', 100, 'Common', 'A beautiful freshwater fish.', 'Increased XP gain', 0.2000, 1),
    ('Clownfish', 150, 'Common', 'Famous from a certain movie.', 'Increased coin drop', 0.1800, 1),
    ('Betta', 120, 'Common', 'An aggressive but colorful fish.', 'Attack boost', 0.1900, 1),
    ('Goldfish', 80, 'Common', 'A classic pet fish.', 'Memory boost', 0.2100, 1),
    ('Guppy', 60, 'Common', 'Small and easy to care for.', 'Breeding boost', 0.2200, 1),

    ('Lionfish', 300, 'Uncommon', 'Venomous but beautiful.', 'Poison attack', 0.1500, 5),
    ('Pufferfish', 350, 'Uncommon', 'Inflates when threatened.', 'Defense boost', 0.1400, 5),
    ('Seahorse', 250, 'Uncommon', 'A fascinating marine creature.', 'Healing boost', 0.1600, 5),
    ('Butterflyfish', 280, 'Uncommon', 'Colorful coral reef fish.', 'Speed boost', 0.1550, 5),
    ('Parrotfish', 260, 'Uncommon', 'Eats algae off coral.', 'Coral protection', 0.1650, 5),

    ('Tuna', 500, 'Rare', 'A fast ocean predator.', 'Speed burst', 0.1000, 10),
    ('Swordfish', 550, 'Rare', 'Known for its sharp bill.', 'Piercing attack', 0.0900, 10),
    ('Barracuda', 480, 'Rare', 'A fearsome predator.', 'Critical hit chance', 0.1100, 10),
    ('Mahi Mahi', 520, 'Rare', 'Brightly colored surface fish.', 'Agility boost', 0.0950, 10),
    ('Snapper', 460, 'Rare', 'Popular in fishing.', 'Extra loot', 0.1200, 10),

    ('Shark', 1000, 'Epic', 'The ocean apex predator.', 'Fear aura', 0.0500, 20),
    ('Marlin', 900, 'Epic', 'Known for its speed.', 'Speed dominance', 0.0600, 20),
    ('Stingray', 850, 'Epic', 'Graceful bottom-dweller.', 'Electric shock', 0.0700, 20),
    ('Giant Trevally', 800, 'Epic', 'A powerful game fish.', 'Power boost', 0.0800, 20),
    ('Wahoo', 870, 'Epic', 'Fast and aggressive.', 'Attack speed boost', 0.0650, 20),

    ('Coelacanth', 2000, 'Legendary', 'Ancient living fossil.', 'Time manipulation', 0.0100, 30),
    ('Megalodon', 2500, 'Legendary', 'Extinct giant shark.', 'Terrifying presence', 0.0050, 30),
    ('Kraken', 3000, 'Legendary', 'Mythical sea monster.', 'Tentacle crush', 0.0030, 30),
    ('Leviathan', 3500, 'Legendary', 'Oceanic colossus.', 'Abyssal roar', 0.0020, 30),
    ('Mermaid', 4000, 'Legendary', 'Mythical sea guardian.', 'Song of control', 0.0010, 30),

    ('Blobfish', 200, 'Special', 'So ugly its cute.', 'Sadness aura', 0.1000, 15),
    ('Axolotl', 300, 'Special', 'An adorable amphibian.', 'Regeneration', 0.0900, 15),
    ('Deep Sea Dragonfish', 1000, 'Special', 'Bioluminescent deep-sea predator.', 'Night vision', 0.0500, 15),
    ('Lanternfish', 400, 'Special', 'Lights up the dark depths.', 'Light aura', 0.0700, 15),
    ('Yeti Crab', 600, 'Special', 'Discovered in hydrothermal vents.', 'Heat resistance', 0.0600, 15)
) AS new_data(name, price, rarity, description, special_ability, pool_rate, unlock_level)
WHERE NOT EXISTS (
    SELECT 1 FROM fish WHERE name = new_data.name
);

-- Insert factory data only if the table is empty
INSERT INTO factory (name, price, production_rate)
SELECT * FROM (
    VALUES
    ('Small Fishing Dock', 1200, 90),
    ('Coastal Fishery', 1800, 85),
    ('Deep Sea Fishing Vessel', 2500, 80),
    ('Industrial Hatchery', 3000, 75),
    ('Aquaponics Farm', 3200, 70),
    ('Offshore Fish Farm', 3500, 65),
    ('Eco-Friendly Hatchery', 4000, 60),
    ('Gourmet Seafood Facility', 4200, 55),
    ('Premium Hatchery', 4600, 50),
    ('Sustainable Fishing Harbor', 5000, 45),
    ('Luxury Fish Breeding Center', 5500, 40),
    ('Arctic Fishery', 6000, 35),
    ('Exotic Fish Breeding Lab', 6500, 30),
    ('Tropical Fish Breeding Facility', 7000, 25),
    ('High-Tech Aquaculture Facility', 7500, 20),
    ('Elite Fish Farming Enterprise', 8000, 15),
    ('Rare Species Conservation Center', 8500, 10),
    ('Deep Ocean Aquaculture', 9000, 8),
    ('Advanced Fishery Research Lab', 9500, 5),
    ('Ultimate Seafood Processing Hub', 10000, 2)
) AS new_data(name, price, production_rate)
WHERE NOT EXISTS (
    SELECT 1 FROM factory WHERE name = new_data.name
);
