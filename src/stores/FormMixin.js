import Actions from './../actions/Form';
import StateMixin from 'reflux-state-mixin';

var FormMixin = {
    mixins: [StateMixin.store],
    listenables: Actions,
    getInitialState: function(){
        return {model: {
            
        }};
    },
    onModelUpdate: function(name, nextValue){
        var model = this.state.model
        model[name] = nextValue;
        this.setState({model: model});
    },
};

module.exports = {repository: FormMixin, actions: Actions}