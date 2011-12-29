# Server endpoints to deal with syncronizing server and client.
# All routes are under /sync

FiesStore.controllers :sync do
  # We send in a json serialized dump of localStorage. Turn into database and store.
  post :push do

  end


  # Dump db to client.
  get :pull do

    content_type 'application/json'
    "PULL"
  end
end
