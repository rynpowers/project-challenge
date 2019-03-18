class LikesController < ApplicationController
  def post
    respond_to do |format|
      if user_signed_in?
        if Like.create(dog_id: params[:id], user_id: current_user.id)
          format.json { head :no_content }
        end
      else
        format.json {render status: :unauthorized}
      end
    end
  end

  def destroy
    respond_to do |format|
      if user_signed_in?
        if Like.find_by(dog_id: params[:id], user_id: current_user.id).destroy
          format.json { head :no_content }
        end
      else
        format.json {render status: :unauthorized}
      end
    end
  end
end
