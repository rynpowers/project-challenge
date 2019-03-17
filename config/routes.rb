Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  devise_for :users
  resources :dogs
  put '/dogs/:id/like', to: 'likes#update'
  root to: "dogs#index"
end
