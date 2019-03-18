class Like < ApplicationRecord
  belongs_to :dog
  belongs_to :user

  validate :not_owner

  private
  def not_owner
    puts "==================="
    puts "validating", Dog.find(self.dog_id).user_id, self.user_id
    puts "==================="
    if Dog.find(self.dog_id).user_id == self.user_id
      puts "throwing error"
      errors.add("you can't like your own pet")
    end
  end
end
