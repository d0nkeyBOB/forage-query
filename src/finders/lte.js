(function(root, undefined) {

    'use strict';

    var Query = root.Query;


    /**
     * @function
     * @description specifies a $lte query condition.
     * @param  {String} [path]  optional item path to perform comparison on.
     *                        if not specified previous path will be used
     * @param  {Object} value a value to be compared with the path value
     * @return {Query}       this
     * @public
     * @see {@link https://docs.mongodb.org/manual/reference/operator/query/lte/|$lte}
     * @example
     * Thing.find().where('age').lte(21)
     *
     * // or
     * Thing.find().lte('age', 21)
     */
    Query.prototype.lte = function(path, value) {
        /*jshint validthis:true*/
        var self = this;

        // tell what operation to perform
        self._operation = 'find';

        //check if path is specified explicit
        if (_.size(arguments) === 2) {
            //if so, update path to use in the clause
            self._path = path;
        }

        //otherwise only value specified
        else {
            //set value to be used in comparison
            value = path;
        }

        //build where clause and update current query conditions
        var criteria = {};
        criteria[self._path] = {
            '$lte': value
        };

        //return self
        return self.where(criteria);
    };

}(this));