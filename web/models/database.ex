use Amnesia

defdatabase Database do

  deftable Room, [{ :id, autoincrement }, :slug, :locked], type: :ordered_set, index: [:slug] do
    @type t :: %Room {
      id: non_neg_integer,
      slug: String.t,
      locked: boolean
    }
  end

  deftable Message, [{ :id, autoincrement }, :room, :user, :time, :content], type: :ordered_set do
    @type t :: %Message {
      id: non_neg_integer,
      room: non_neg_integer,
      user: String.t,
      time: non_neg_integer,
      content: String.t
    }
  end

  deftable Drawing, [{ :id, autoincrement }, :room, :user, :time, :identifier, :path], type: :ordered_set do
    @type t :: %Drawing {
      id: non_neg_integer,
      room: non_neg_integer,
      user: String.t,
      time: non_neg_integer,
      identifier: String.t,
      path: [
        %{ x: float, y: float }, ...
      ]
    }
  end
end
