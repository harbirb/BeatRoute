-- Create profiles table
CREATE TABLE profiles (
	id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
	name TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
	FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
	FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
	FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger to insert profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO public.profiles (id)
	VALUES (new.id);
	RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE PROCEDURE public.handle_new_user();

-- Backfill profiles for existing auth users who don't have a profile yet
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT DO NOTHING;
