class Dog < ApplicationRecord
  before_destroy :destroy_likes

  has_many_attached :images
  belongs_to :user

  has_many :likes
  has_many :liking_users, :through => :likes, :source => :user

  validate :image_type

  def image_type
    images.each do |image|
      if !image.content_type.in?(%('image/jpeg', 'image/png'))
        image.purge_later
        errors.add(:images, 'needs to be a JPEG or PNG')
      end
    end
  end

   def destroy_likes
     self.likes.destroy_all
   end
end
