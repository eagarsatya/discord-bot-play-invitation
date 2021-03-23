create table discord_user(
	usertag varchar(100) not null,
	created_on timestamp
);

create table play_invitation(
	user_id varchar(100) not null,
	channel_id varchar(100) not null,
	game varchar(100) not null,
	created_on timestamp not null,
	play_time timestamp not null,
	play_invitation_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
);

create table play_invitation_participant(
	play_invitation_id INT,
	user_id varchar(100) not null,
	created_on timestamp not null,
	play_invitation_participant_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	CONSTRAINT fk_play_invitation FOREIGN KEY (play_invitation_id) REFERENCES play_invitation(play_invitation_id) ON DELETE CASCADE
);

drop table play_invitation_participant
drop table play_invitation