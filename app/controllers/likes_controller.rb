class LikesController < ApplicationController
  def update
    @like = Like.find_by(dog_id: params[:id], user_id: current_user)
  end
end
