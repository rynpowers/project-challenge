json.dogs @dogs do |dog|
  json.extract! dog, :id, :name, :description, :images, :created_at, :updated_at
  json.images dog.images.map { |image| url_for(image) }
  json.url dog_url(dog, format: :html)
  json.likes dog.likes.length
  json.user_liked current_user ? dog.likes.select {|like| like.user_id == current_user.id }.length == 1 : false
  json.isOwner user_signed_in? ? current_user.id == dog.user_id : false
end
json.signed_in user_signed_in?
json.pages @dogs.total_entries / 5 + (@dogs.total_entries % 5)

