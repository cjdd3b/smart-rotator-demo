(function() {
  
  var dumb_rotator = {
    /*
    A naive comment rotator that displays comments from a list in random
    or sequential order.
    */
    randomize: true,
    data: null,

    initialize: function() {
      /*
      Public method.

      Initializes the dumb rotator
      */
      var self = this;

      $.ajax({
        url: 'data/weed-processed.json',
        dataType: 'json',
        success: function(data) {
          // Add cleaned data to dumb_rotator scope
          self.data = self._clean(data.all_submissions);

          // Randomize the data if needed
          if (self.randomize) {
            self.data = self._shuffle(self.data);
          }

          // Initialize the rotator with the first comment
          $('#dumbrotator').html(self.data[0].overview_initial_comment).fadeIn(1000)

          // Perform comment rotation. Start over at the beginning when
          // the end of the comments list is reached.
          var i = 0;
          var rotate = function() {
            $('#dumbrotator').delay(3000).fadeOut(1000, function(){
              if (i++ == self.data.length - 1){
                i = 0;
              }                    

              comment = self.data[i].overview_initial_comment;
              $('#dumbrotator').html(comment).fadeIn(1000, rotate);
            });
          }

          rotate();

        }
      });            
    },

    _clean: function(data) {
      /*
      Private method.

      Does some cleaning operations specific to this data, specifically removing
      any items from the list that don't have an overview_initial_comment.
      */
      var self = this;

      $(data).each(function(i){
        if (this.overview_initial_comment == null) {
          data.splice(i);
        }
      });

      return data;
    },

    _shuffle: function(data) {
      /*
      Private method.

      Executes Fisher-Yates shuffle on the data. Could just use random indices,
      but YOLO.
      */
      var m = data.length, t, i;

      while (m) {
        i = Math.floor(Math.random() * m--);

          t = data[m];
          data[m] = data[i];
          data[i] = t;
      }

      return data;
    }

  }

  var smart_rotator = {
    /*
    A smart comment rotator that displays comments according to topics derived
    from non-negative matrix factorization. The hypothesis is that this rotator
    will display a better cross-section of the arguments presented in the comments
    than a naive rotator would.
    */
    data: null,
    restrict_topics: null,

    initialize: function() {
      /*
      Public method.

      Initializes the smart rotator
      */
      var self = this;

      $.ajax({
        url: 'data/weed-processed.json',
        dataType: 'json',
        success: function(data) {
          // Build a topics-based index of comments for the object scope
          self.data = self._educate(data.all_submissions);

          // Just getting a list of topic keys. Doing it old-school.
          var topics = [];
          for(var k in self.data) { topics.push(k); }

          // TODO: ADD ABILITY TO RESTRICT TOPIC LIST FOR DEMO

          // Initialize the rotator with the first comment
          $('#smartrotator').html(self.data[topics[0]][0].overview_initial_comment).fadeIn(1000)

          // Perform comment rotation. In this case, just cycles through each
          // topic in sequence, then picks a random comment from that topic. At
          // some point would also want to address things like comments that don't
          // fall into any topic.
          var i = topics[0];
          var rotate = function() {
            $('#smartrotator').delay(3000).fadeOut(1000, function(){
              if (i++ == topics.length - 1){
                i = 0;
              }

              var random = Math.floor(Math.random() * self.data[topics[i]].length);

              comment = self.data[topics[i]][random].overview_initial_comment;
              $('#smartrotator').html(comment).fadeIn(1000, rotate);
            });
          }

          rotate();

        }

      });            
    },

    _educate: function(data) {
      /*
      Private method.

      Builds a simple index of comments based on topic IDs, as per
      the "topics" array in the JSON object.
      */
      var self = this;

      var index = {};
      $(data).each(function(i){
        // Disregard anything that doesn't have a comment
        if (this.overview_initial_comment != null) {
          var comment = this;

          // Each comment can belong to multiple topics, and we want to
          // reflect that in the index.
          $(this.topics).each(function(i) {
            var topic = this;
            if (!(topic in index)) {
              index[topic] = [];
            }
            index[topic].push(comment);
          });
          
        }
      });

      return index;

    }

  }

  /********** MAIN **********/

  dumb_rotator.initialize();
  smart_rotator.initialize();

})();
