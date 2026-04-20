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
	headerBackground: {
		height: 50,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 5
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
	messageBox: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: Dark.secondary,
		width: '95%',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 10,
		marginBottom: 25,
		padding: 3,
		zIndex: 997
	},
	messageInputField: {
		backgroundColor: Dark.background,
		color: '#fff',
		width: '100%'
	},
	sendButton: {
		position: 'absolute',
		right: 0,
		marginRight: 10,
		backgroundColor: Dark.success,
		borderRadius: 50,
		padding: 5,
		zIndex: 997
	},
	messageIn: {
		backgroundColor: Dark.secondary,
		borderRadius: 15,
		zIndex: 997
	},
	messageOut: {
		backgroundColor: Dark.dark,
		borderRadius: 15,
		marginLeft: 'auto',
		zIndex: 997
	},
	connectionCard: {
		display: "flex",
		flexDirection:"row",
		zIndex:999,
		position:"absolute",
		marginTop: 20,
		height: "100%",
		minHeight: 600
	},
	connectionWindow: {
		width: "100%",
		paddingTop: 50
	},
	connectionBackdrop: {
		backgroundColor: Dark.background,
		width: "100%",
		height: "100%",
		position:"absolute"
	},
	userCard: {
		display: "flex",
		backgroundColor: Dark.background,
		width: "95%",
		height: 35,
		marginTop: 10,
		alignItems: "center",
		marginLeft: 'auto',
		marginRight: 'auto',
		padding: 5,
	},
	logoutTile: {
		display: "flex",
		backgroundColor: Dark.background,
		alignItems: "center",
		justifyContent: "center",
		width: "90%",
		marginLeft: "auto",
		marginRight: "auto",
		borderRadius: 5,
		padding: 10,
		boxShadow: '2 2 7 0',
		shadowColor: '#0000001a',
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
	},
	buttonSuccessSmall: {
		display: 'flex',
		height: 38,
		width: 38,
		borderRadius: 5,
		padding: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Dark.success,
	},
	buttonSuccessXS: {
		display: 'flex',
		height: 18,
		width: 18,
		borderRadius: 5,
		padding: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Dark.success,
	}
})