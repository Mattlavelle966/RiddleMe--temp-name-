import { Dark } from '../assets/theme/colours'; // Ensure this points to colours.ts
import { StyleSheet } from "react-native";

export const darkmode = StyleSheet.create({
    // --- Layout & Utilities ---
    screenContainer: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 20, 
        gap: 12,
        backgroundColor: Dark.background
    },
    authWell: {
        display: "flex", 
        height: 400, 
        width: "100%", 
        maxWidth: 400, 
        justifyContent: 'space-between'
    },
    menuToggleLeft: { 
        position: "absolute",
        zIndex: 999,
        left: 15,
        top: 15
    },
    homeContainer: {
        flex: 1,
        backgroundColor: Dark.background
    },
    row: {
        display: "flex",
        flexDirection: "row"
    },
    rowBetween: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    w100: { width: "100%" },
    mt10: { marginTop: 10 },
    mt30: { marginTop: 30 },
    mb14: { marginBottom: 14 },
    autoMargin: { marginLeft: "auto", marginRight: "auto" },

    // --- Desktop Specific ---
    desktopLayout: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    sidebarDesktop: {
        width: 320,
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: Dark.dark,
    },
    mainDesktop: {
        flex: 1,
        height: '100%',
    },

    // --- Typography & Headers ---
    header: { color: '#fff', fontSize: 32 },
    headerBackground: {
        height: 70, 
        paddingTop: 20, 
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    subHeader: { color: '#fff', fontSize: 12 },
    label: { color: '#fff', fontSize: 15 },
    link: {
        color: Dark.highlight,
        textDecorationLine: 'underline',
        fontSize: 12,
        cursor: "pointer"
    },
    linkRight: {
        color: Dark.highlight,
        textDecorationLine: 'underline',
        fontSize: 12,
        cursor: "pointer",
        marginLeft: 'auto'
    },
    error: { color: Dark.danger, fontSize: 10 },

    // --- Forms & Wells ---
    well: {
        minWidth: 250,
        minHeight: 300,
        borderRadius: 4,
        backgroundColor: Dark.secondary,
        boxShadow: '4 4 6 0',
        shadowColor: '#0000001a',
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    authWell: {
        display: "flex", 
        height: 400, 
        justifyContent: 'space-between'
    },
    textInput: {
        borderRadius: 4,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: Dark.highlight,
        backgroundColor: Dark.light,
        padding: 10
    },

    // --- Chat Elements ---
    chatEmpty: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        alignItems: "center"
    },
    chatContainer: {
        display: 'flex', 
        height: '100%', 
        justifyContent: 'space-between'
    },
    chatScroll: {
        display: 'flex', 
        flexDirection: 'column-reverse', 
        width: '95%', 
        marginLeft:'auto', 
        marginRight:'auto'
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
        zIndex: 997,
        borderRadius: 4
    },
    messageInputField: {
        backgroundColor: Dark.background,
        color: '#fff',
        width: '100%',
        padding: 10,
        borderRadius: 4,
        zIndex: 999
    },
    sendButton: {
        position: 'absolute',
        right: 0,
        marginRight: 10,
        backgroundColor: Dark.success,
        borderRadius: 50,
        padding: 5,
        zIndex: 999
    },
    messageBubble: {
        maxWidth: 240, 
        padding: 10, 
        alignSelf: 'flex-start'
    },
    messageText: { color: '#fff' },
    messageIn: { backgroundColor: Dark.secondary, borderRadius: 15, zIndex: 997 },
    messageOut: { backgroundColor: Dark.dark, borderRadius: 15, marginLeft: 'auto', zIndex: 997 },

    // --- Menus & Connections ---
    connectionCard: {
        display: "flex",
        flexDirection: "row",
        zIndex: 999,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    connectionWindow: {
        width: "100%",
        paddingTop: 50,
        flex: 1 
    },
    connectionWindowInner: {
        display: "flex",
        flex: 1, 
        justifyContent: "space-between",
        paddingBottom: 40
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
        height: 40, 
        marginTop: 10,
        justifyContent: "center", 
        alignItems: "center",
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingHorizontal: 10, 
        borderRadius: 4 
    },
    userStatusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
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
    logoutText: { fontSize: 20, color: "#fff" },

    // --- Buttons ---
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
    buttonSuccessFull: {
        width: "100%", 
        marginTop: 10,
        display: 'flex',
        height: 35,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Dark.success,
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
    },
    menuToggle: {
        position: "absolute", 
        zIndex: 999,
        right: 10, 
        top: 10
    }
});