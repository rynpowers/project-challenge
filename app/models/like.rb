class Like < ApplicationRecord
  belongs_to :dog
  belongs_to :user

  validate :not_owner
  validate :no_duplicates

  private
  def not_owner
    if Dog.find(self.dog_id).user_id == self.user_id
      errors.add("you can't like your own pet")
    end
  end

  def no_duplicates
    user_likes = Dog.find(self.dog_id).likes.select { |like| like.user_id == self.user_id}

    if !user_likes.empty?
      errors.add("No duplicate likes")
    end
  end
end
