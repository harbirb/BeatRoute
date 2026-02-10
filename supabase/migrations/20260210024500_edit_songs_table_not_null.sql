-- 1. Update existing NULL values to a default empty string (or placeholder) 
--    to ensure the NOT NULL constraint can be applied successfully.
UPDATE songs 
SET album_art_url = '' 
WHERE album_art_url IS NULL;

UPDATE songs 
SET spotify_url = '' 
WHERE spotify_url IS NULL;

-- 2. Apply the NOT NULL constraint
ALTER TABLE songs 
ALTER COLUMN album_art_url SET NOT NULL;

ALTER TABLE songs 
ALTER COLUMN spotify_url SET NOT NULL;
