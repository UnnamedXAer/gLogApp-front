// eslint-disable-next-line
import ExerciseModel, { UsersExerciseModel, SetModel, ExercisesListModel } from './Model/ExerciseModel/ExerciseModel';
// eslint-disable-next-line
import UserModel from './Model/UserModel/UserModel';



export const menuData = [
    {id: 'home1Key', name: 'Home', icon: 'home_1.png', description: "Home page"},
    {id: 'you1Key', name: 'You', icon: 'inconex1.png', description: "Your profile/settings"},
    {id: 'about1Key', name: 'About', icon: 'inconex1.png', description: "About application"},
    {id: 'id1df4fhj', name: 'exer13', icon: 'inconex13.png', description: 'sfd sdfsadf asdf sadfsa fsa/ .sadf sadf sadf .sadf sdf'},
    {id: 'id1df4fgh', name: 'exer14', icon: 'inconex14.png'},
    {id: 'id1df4fsd', name: 'exer15', icon: 'inconex15.png'},
    {id: 'id1df4f2d', name: 'exer25', icon: 'inconex25.png'},
    {id: 'id1df4f3d', name: 'exer52', icon: 'inconex52.png'},
    {id: 'id1df4f4d', name: 'exer54', icon: 'inconex54.png'},
    {id: 'id1df4f5d', name: 'exer12', icon: 'inconex12.png'},
    {id: 'id1df4ffd4', name: 'exer33', icon: 'inconex33.png'},
    {id: 'id1df4ffdf', name: 'exer33', icon: 'inconex33.png'},
    {id: 'id1df4ffda', name: 'exer33', icon: 'inconex33.png'},
    {id: 'id1df4ffdd', name: 'exer33', icon: 'inconex33.png'},
    {id: 'id1df4ffd2', name: 'exer33', icon: 'inconex33.png'},
    {id: 'id1df4ffd1', name: 'exer33', icon: 'inconex33.png'},
];



export const exerciseExample = {
    name: 'squat',
    weights: [10,14,18,20,20,20,20],
    reps: [8,5,3,8,8,8,8],
    comment: 'easy, +2.5 next week'
};


export const exercise_Table = [
    {
        exId:'00111',
        exName:'deadlift', 
        exIconFileName:'deadlift1.png', 
        exDescription:'pull the bar!'
    },
    {
        exId:'00112', 
        exName:'squat', 
        exIconFileName:'squat1.png', 
        exDescription:'stand up with the bar!'
    },
    {
        exId:'00113', 
        exName:'ohp', 
        exIconFileName:'ohp1.png', 
        exDescription:'push the bar over your head!'
    },
    {
        exId:'00114',
        exName:'benchpress',
        exIconFileName:'benchpress1.png', 
        exDescription:'push the bar or die'
    },
    {
        exId:'00115',
        exName:'deadlift2222', 
        exIconFileName:'deadlift1.png', 
        exDescription:'pull the bar!1'
    },
    {
        exId:'00116',
        exName:'deadlift333', 
        exIconFileName:'deadlift1.png', 
        exDescription:'pull the bar!2'
    },
]; 

export const user_Table = [
    {
        id: '00001',
        login: 'kt',
    },
    {
        id: '00010',
        login: 'admin'
    },
    {
        id: '00101',
        login: 'user1'
    },
    {
        id: '00102',
        login: 'user2'
    }
];


export const training_Table = [
    {
        trId: '000001',
        trUsId: '00001',
        trStartDate: '12/07/2018 13:03',
        trEndDate: '12/07/2018 14:47',
        trComment: 'too long!'
    },
    {
        trId: '000002',
        trUsId: '00101',
        trStartDate: '12/08/2018 19:12',
        trEndDate: '12/08/2018 21:34',
        trComment: ''
    },
    {
        trId: '000003',
        trUsId: '00102',
        trStartDate: '12/09/2018 08:15',
        trEndDate: '12/09/2018 09:48',
        trComment: 'fbw'
    }
];

export const set_Table = [
    {
        setId: '001011',
        setTrId: '0000001', //7-digit
        setWeight: '12', //kg
        setReps: '8',
        setComment: 'too much'
    }
];

export const exerciseDbResults = exercise_Table.map(x => new ExerciseModel(x.exId, x.exName, x.exIconFileName, x.exDescription));
export const userDbResults = user_Table.map(x => new UserModel(x.id, x.login));




export const fakeJSON = [
    {id:1, name: 'jabłko'},
    {id:12, name: 'pomarańcza'},
    {id:13, name: 'gruszka'},
    {id:14, name: 'ślwika'},
    {id:15, name: 'banan'},
    {id:16, name: 'cytryna'},
    {id:17, name: 'mango'},
    {id:18, name: 'arbuz'},
    {id:19, name: 'anans'},
    {id:10, name: 'mandarynka'},
    {id:21, name: 'avocado'},
    {id:31, name: 'kiwi'},
    {id:41, name: 'pomidor'},
    {id:51, name: 'grejfrut'},
    {id:61, name: 'morela'},
    {id:71, name: 'granat'},
    {id:81, name: 'jagoda'},
    {id:91, name: 'agrest'},
    {id:101, name: 'malina'},
    {id:111, name: 'jeżyna'},
    {id:121, name: 'truskawka'},
    {id:131, name: 'poziomka'},
    {id:141, name: 'wino'},
    {id:151, name: 'wiśnia'},
    {id:161, name: 'czereśnia'}
];