import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type ThozhiContact = {
    id : Nat;
    userId : Principal;
    name : Text;
    phone : Text;
    relation : Text;
    isDefault : Bool;
  };

  type ThozhiDietEntry = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    isPreloaded : Bool;
    createdBy : ?Principal;
  };

  type ThozhiFirstAidEntry = {
    id : Nat;
    situation : Text;
    steps : [Text];
    isPreloaded : Bool;
    createdBy : ?Principal;
  };

  type ThozhiWorkoutEntry = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    duration : Text;
    difficulty : Text;
  };

  type ThozhiLocalService = {
    id : Nat;
    name : Text;
    type_ : Text;
    address : Text;
    phone : Text;
    district : Text;
  };

  type ThozhiUserProfile = {
    name : Text;
    age : Nat;
    healthCondition : Text;
  };

  type ThozhiWorkoutNote = {
    id : Nat;
    category : Text;
    title : Text;
    description : Text;
    createdBy : Principal;
  };

  type OldActor = {
    emergencyContacts : Map.Map<Nat, ThozhiContact>;
    dietEntries : Map.Map<Nat, ThozhiDietEntry>;
    firstAidEntries : Map.Map<Nat, ThozhiFirstAidEntry>;
    workoutEntries : Map.Map<Nat, ThozhiWorkoutEntry>;
    localServices : Map.Map<Nat, ThozhiLocalService>;
    userProfiles : Map.Map<Principal, ThozhiUserProfile>;
    emergencyContactIdCounter : Nat;
    dietEntryIdCounter : Nat;
    firstAidEntryIdCounter : Nat;
    workoutEntryIdCounter : Nat;
    localServiceIdCounter : Nat;
    isInitialized : Bool;
  };

  type NewActor = {
    emergencyContacts : Map.Map<Nat, ThozhiContact>;
    dietEntries : Map.Map<Nat, ThozhiDietEntry>;
    firstAidEntries : Map.Map<Nat, ThozhiFirstAidEntry>;
    workoutEntries : Map.Map<Nat, ThozhiWorkoutEntry>;
    localServices : Map.Map<Nat, ThozhiLocalService>;
    userProfiles : Map.Map<Principal, ThozhiUserProfile>;
    workoutNotes : Map.Map<Nat, ThozhiWorkoutNote>;
    emergencyContactIdCounter : Nat;
    dietEntryIdCounter : Nat;
    firstAidEntryIdCounter : Nat;
    workoutEntryIdCounter : Nat;
    localServiceIdCounter : Nat;
    workoutNoteIdCounter : Nat;
    isInitialized : Bool;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      workoutNotes = Map.empty<Nat, ThozhiWorkoutNote>();
      workoutNoteIdCounter = 1;
    };
  };
};
