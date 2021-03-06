(function(root, undefined) {

	'use strict';

	var Query = root.Query;

	/**
	 * @description remove existing item(s) using specified criteria
	 * @param {Object} [criteria]  selector
	 * @param  {Function} [done]   a callback to invoke on success or error
	 * @return {Query}             query instance
	 */
	Query.prototype.remove = function(criteria, done) {
		//TODO make use of sub queries

		// jshint validthis:true
		var self = this;

		//tell what operation to perform
		self._operation = 'remove';

		//normalize arguments
		if (criteria && _.isFunction(criteria)) {
			done = criteria;
			criteria = {};
		}

		if (criteria && !self._removes) {
			//find items to remove
			var query = new self.Query();
			self._removes = query.find.call(query, criteria);
			//TODO clone other criteria and merge to self._removes
			if (self._limit) {
				self._removes.limit(self._limit);
			}
		}

		//remove items
		if (done && _.isFunction(done)) {
			self._removes.then(function(items) {
				//update _removes reference
				self._removes = items;

				//perfom remove
				return self._remove();
			}).then(function(items) {
				done(null, items);
			}).catch(function(error) {
				done(error);
			});
		}

		return self;
	};


	/**
	 * @function
	 * @name _remove
	 * @description remove current items in query _removes queue(collection)
	 * @private
	 */
	Query.prototype._remove = function() {
		//jshint validthis:true
		var self = this;

		//prepare removes
		var removes = _.map([].concat(self._removes), function(item) {
			var id = _.get(item, 'id') || _.get(item, '_id');
			return self.localForage.removeItem(id).then(function() {
				return id;
			});
		});

		//compact removes
		removes = _.compact(removes);

		//perform batch remove
		removes = self.Promise.all(removes);

		return removes.then(function( /*results*/ ) {
			//return removed items
			return self._removes;
		});

	};

}(this));