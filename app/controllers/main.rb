FiesStore.controller do
  layout :main

  get :index do
    render "index"
  end

  get :test do
    render "test"
  end
end
