-- Inserimento utenti
INSERT INTO users (name) VALUES
('Alessia'),
('Davide'),
('Chiara');

-- Inserimento dati fittizi per 6 mesi
DO $$
DECLARE
    start_date DATE := CURRENT_DATE - INTERVAL '6 months';
    end_date DATE := CURRENT_DATE;
    u RECORD;
    d DATE;
    categories_expenses TEXT[] := ARRAY['spesa', 'sigarette', 'divertimento', 'vestiti', 'bollette', 'trasporti'];
    categories_incomes TEXT[] := ARRAY['stipendio', 'bonus', 'investimenti', 'regalo', 'furto'];
BEGIN
    FOR u IN SELECT id, name FROM users LOOP
        d := start_date;
        WHILE d <= end_date LOOP
            -- Spesa fittizia
            INSERT INTO expenses (user_id, created_at, amount, category, description)
            VALUES (
                u.id,
                d,
                            round((random()*100+10)::numeric, 2),
                categories_expenses[ceil(random()*array_length(categories_expenses,1))],
                'Spesa di ' || u.name || ' il ' || d
            );
            -- Entrata fittizia
            INSERT INTO incomes (user_id, created_at, amount, category, description)
            VALUES (
                u.id,
                d,
                            round((random()*200+50)::numeric, 2),
                categories_incomes[ceil(random()*array_length(categories_incomes,1))],
                'Entrata di ' || u.name || ' il ' || d
            );
            d := d + INTERVAL '1 day';
        END LOOP;
    END LOOP;
END $$;
