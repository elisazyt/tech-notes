#!/usr/bin/env ruby
#
# Jekyll's _posts collection only recognizes files named YYYY-MM-DD-title.md.
# Since this site never displays post dates, there's no reason to type one by
# hand: before each build, any file in _posts/ that's missing the date prefix
# gets it prepended automatically (using today's date), then Jekyll reads it
# like any other post.

Jekyll::Hooks.register :site, :after_reset do |site|
  posts_dir = File.join(site.source, '_posts')
  next unless Dir.exist?(posts_dir)

  date_prefix = /\A\d{4}-\d{2}-\d{2}-/
  today = Time.now.strftime('%Y-%m-%d')

  Dir.glob(File.join(posts_dir, '*.{md,markdown}')).each do |path|
    filename = File.basename(path)
    next if filename =~ date_prefix

    new_path = File.join(posts_dir, "#{today}-#{filename}")
    File.rename(path, new_path)
  end
end
