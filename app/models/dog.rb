class Dog < ApplicationRecord
  has_many_attached :images
  belongs_to :user

  validate :image_type

  def image_type
    if images.attached? == false
      errors.add(:images, 'are missing!')
    end

    images.each do |image|
      if !image.content_type.in?(%('image/jpeg', 'image/png'))
        image.purge_later
        errors.add(:images, 'needs to be a JPEG or PNG')
      end
    end
  end
end
