import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = (props) =>
  props.alerts !== null &&
  props.alerts.length > 0 &&
  props.alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// This function is passed in to connect which passed the state object to it
// Because curly braces are used to denote the function’s body ({}), an arrow function that wants to return an object literal outside of a function body must wrap the literal in parentheses.
// TLDR; ({}) means return whatever is inside
// EX. https://humanwhocodes.com/blog/2013/09/10/understanding-ecmascript-6-arrow-functions/#:~:text=Because%20curly%20braces%20are%20used,wrap%20the%20literal%20in%20parentheses.&text=Wrapping%20the%20object%20literal%20in,instead%20of%20the%20function%20body.
// var getTempItem = id => ({ id: id, name: "Temp" });
// // effectively equivalent to:
// var getTempItem = function(id) {
//     return {
//         id: id,
//         name: "Temp"
//     };
// };
// Maping redux state to a prop so we have access to it
const mapStateToProps = (state) => {
  console.log('mapping state to alert prop');
  // Pick the reducer you want the state to
  // state.alert comes from the combine reducer, we are only taking the alert state
  return { alerts: state.alert };
};

// the 1st param gets the state and returns it to the components props
export default connect(mapStateToProps)(Alert);
