const cardList = [
  {
    "suit": "hearts",
    "value": 2
  },
  {
    "suit": "hearts",
    "value": 3
  },
  {
    "suit": "hearts",
    "value": 4
  },
  {
    "suit": "hearts",
    "value": 5
  },
  {
    "suit": "hearts",
    "value": 6
  },
  {
    "suit": "hearts",
    "value": 7
  },
  {
    "suit": "hearts",
    "value": 8
  },
  {
    "suit": "hearts",
    "value": 9
  },
  {
    "suit": "hearts",
    "value": 10
  },
  {
    "suit": "hearts",
    "value": "jack"
  },
  {
    "suit": "hearts",
    "value": "queen"
  },
  {
    "suit": "hearts",
    "value": "king"
  },
  {
    "suit": "hearts",
    "value": "ace"
  },
  {
    "suit": "diamonds",
    "value": 2
  },
  {
    "suit": "diamonds",
    "value": 3
  },
  {
    "suit": "diamonds",
    "value": 4
  },
  {
    "suit": "diamonds",
    "value": 5
  },
  {
    "suit": "diamonds",
    "value": 6
  },
  {
    "suit": "diamonds",
    "value": 7
  },
  {
    "suit": "diamonds",
    "value": 8
  },
  {
    "suit": "diamonds",
    "value": 9
  },
  {
    "suit": "diamonds",
    "value": 10
  },
  {
    "suit": "diamonds",
    "value": "jack"
  },
  {
    "suit": "diamonds",
    "value": "queen"
  },
  {
    "suit": "diamonds",
    "value": "king"
  },
  {
    "suit": "diamonds",
    "value": "ace"
  },
  {
    "suit": "clubs",
    "value": 2
  },
  {
    "suit": "clubs",
    "value": 3
  },
  {
    "suit": "clubs",
    "value": 4
  },
  {
    "suit": "clubs",
    "value": 5
  },
  {
    "suit": "clubs",
    "value": 6
  },
  {
    "suit": "clubs",
    "value": 7
  },
  {
    "suit": "clubs",
    "value": 8
  },
  {
    "suit": "clubs",
    "value": 9
  },
  {
    "suit": "clubs",
    "value": 10
  },
  {
    "suit": "clubs",
    "value": "jack"
  },
  {
    "suit": "clubs",
    "value": "queen"
  },
  {
    "suit": "clubs",
    "value": "king"
  },
  {
    "suit": "clubs",
    "value": "ace"
  },
  {
    "suit": "spades",
    "value": 2
  },
  {
    "suit": "spades",
    "value": 3
  },
  {
    "suit": "spades",
    "value": 4
  },
  {
    "suit": "spades",
    "value": 5
  },
  {
    "suit": "spades",
    "value": 6
  },
  {
    "suit": "spades",
    "value": 7
  },
  {
    "suit": "spades",
    "value": 8
  },
  {
    "suit": "spades",
    "value": 9
  },
  {
    "suit": "spades",
    "value": 10
  },
  {
    "suit": "spades",
    "value": "jack"
  },
  {
    "suit": "spades",
    "value": "queen"
  },
  {
    "suit": "spades",
    "value": "king"
  },
  {
    "suit": "spades",
    "value": "ace"
  }
]

const CARD_OFFSET = 50


const addCards = (items) => {
  items.forEach((item, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7
    const offset = CARD_OFFSET * row
    let card = $(`
        <div class="playingcard" id="card" style="top:${offset}px;">
        <img class="responsive-img" src="/images/cardsv2/${item.value}_of_${item.suit}.svg">
        </div>
        `);
    card.data("col", col)
    card.data("row", row)
    card.data("suit", item.suit)
    card.data("value", item.value)
    card.on("mousedown", handle_mousedown)
    $(`#card-col-${col}`).append(card)
  });
}



function getDraggableCardsFromColumn(e) {

  let current = $(e);
  let res = [current]
  while (current.next().length != 0) {
    let next = current.next()
    // if (!isOppositeSuit(current.data("suit"), next.data("suit"))) {
    //   return [];
    // }

    // if (current.data("value") <= next.data("value")) {
    //   return [];
    // }
    res.push(next)
    current = next
  }
  return res;
}

function isOppositeSuit(suit, suit2) {
  let dict = {
    "hearts": ["spades", "clubs"],
    "spades": ["hearts", "diamonds"],
    "diamonds": ["spades", "clubs"],
    "clubs": ["hearts", "diamonds"]
  }
  return suit2 in dict[suit]
}

function handle_mousedown(e) {
  e.preventDefault()
  window.my_dragging = {};
  my_dragging.pageX0 = e.pageX;
  my_dragging.pageY0 = e.pageY;

  let elements = getDraggableCardsFromColumn(this);
  if (elements.length == 0) return;

  my_dragging.elems = elements;
  my_dragging.offsets = elements.map(element => element.offset())

  elements.forEach((element, index) => {
    element.css("z-index", 1000 + index)
  });

  function handle_dragging(b) {
    var left = my_dragging.offsets[0].left + (b.pageX - my_dragging.pageX0);

    my_dragging.elems.forEach((element, index) => {
      var top = my_dragging.offsets[index].top + (b.pageY - my_dragging.pageY0);
      element.offset({ top: top, left: left });
    });
  }



  function handle_mouseup(b) {
    $('body')
      .off('mousemove', handle_dragging)
      .off('mouseup', handle_mouseup);
    let el = getHoverElement($(this), b.pageX, b.pageY)
    console.log(el)

    if (!el || $(el).data('col') == $(elements[0]).data('col')) {
      my_dragging.elems.forEach((element, index) => {
        element.offset({ top: my_dragging.offsets[index].top, left: my_dragging.offsets[0].left });
        element.css("z-index", index)
      });
      return;
    }

    my_dragging.elems.forEach(element => addCardToColumn(element, $(el).data('col')))

  }

  $('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
}

function addCardToColumn(card, col) {
  let childCount = $(`#card-col-${col} .playingcard`).length;
  $(`#card-col-${col}`).append(card)
  $(card).css('top', (childCount) * CARD_OFFSET + 'px');
  $(card).css('left', 0)
}

function getHoverElement(comp, x, y) {
  let res = document.elementsFromPoint(x, y - 75).filter((e) => {
    if (e.id != "card")
      return false;
    console.log($(this).data('col'))
    return $(e).data('col') != $(comp).data('col')
  })
  return res[0]
}
$(document).ready(function () {
  $('.materialboxed').materialbox();
  $('#formSubmit').click(() => {
    submitForm();
  })
  addCards(cardList);
  $('.modal').modal();
});