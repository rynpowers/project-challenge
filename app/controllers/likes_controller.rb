class LikesController < ApplicationController
  def post
    Like.create(dog_id: params[:id], user_id: current_user.id)
  end

  def destroy
    Like.find_by(dog_id: params[:id], user_id: current_user.id).destroy
  end
end
