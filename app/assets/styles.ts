import { Dark } from './theme/colours';
import { StyleSheet, Dimensions } from "react-native";

// for later use with desktop styling.
const { width } = Dimensions.get('window');
const vw = width / 100;

export const darkmode = StyleSheet.create({
	header: {
		color: '#fff',
		fontSize: 32
	},
	subHeader: {
		color: '#fff',
		fontSize: 12
	},
	label: {
		color: '#fff',
		fontSize: 15
	},
	link: {
		color: Dark.highlight,
		textDecorationLine: 'underline',
		fontSize: 12,
		cursor: "pointer"
	},
	error: {
		color: Dark.danger,
		fontSize: 10
	},
	well : {
		minWidth: 250,
		minHeight: 300,
		borderRadius: 4,
		backgroundColor: Dark.secondary,
		boxShadow: '4 4 6 0',
		shadowColor: '#0000001a',
		paddingHorizontal: 30,
		paddingVertical: 10
	},
	textInput: {
		borderRadius: 4,
		borderWidth: 2,
		borderStyle: 'solid',
		borderColor: Dark.highlight,
		backgroundColor: Dark.light,
		padding: 10
	},
	buttonSuccess: {
		display: 'flex',
		maxWidth: 150,
		minWidth: 100,
		height: 35,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Dark.success,
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})