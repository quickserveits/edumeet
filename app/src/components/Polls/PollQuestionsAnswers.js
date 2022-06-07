import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import * as roomActions from "../../store/actions/roomActions";
import PropTypes from "prop-types";
import { useIntl, FormattedMessage } from "react-intl";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MediaPollQuestion from "./MediaPollQuestion";
import AppearancePollQuestion from "./AppearancePollQuestion";
import AdvancedPollQuestion from "./AdvancedPollQuestion";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Close from "@material-ui/icons/Close";

const tabs = ["media", "appearance", "advanced"];

const styles = (theme) => ({
  root: {},
  dialogPaper: {
    width: "30vw",
    [theme.breakpoints.down("lg")]: {
      width: "40vw",
    },
    [theme.breakpoints.down("md")]: {
      width: "50vw",
    },
    [theme.breakpoints.down("sm")]: {
      width: "70vw",
    },
    [theme.breakpoints.down("xs")]: {
      width: "90vw",
    },
  },
  tabsHeader: {
    flexGrow: 1,
  },
});

const PollQuestion = ({
  currentPollQuestionTab,
  PollQuestionOpen,
  handleClosePollQuestion,
  setPollQuestionTab,
  classes,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      className={classes.root}
      open={PollQuestionOpen}
      onClose={() => handleClosePollQuestion(false)}
      classes={{
        paper: classes.dialogPaper,
      }}
    >
      <DialogTitle id="form-dialog-title">
        <FormattedMessage
          id="PollQuestion.PollQuestion"
          defaultMessage="PollQuestion"
        />
      </DialogTitle>
      <Tabs
        className={classes.tabsHeader}
        value={tabs.indexOf(currentPollQuestionTab)}
        onChange={(event, value) => setPollQuestionTab(tabs[value])}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab
          label={intl.formatMessage({
            id: "label.questions",
            defaultMessage: "Questions",
          })}
        />
        <Tab
          label={intl.formatMessage({
            id: "label.Answers",
            defaultMessage: "Answers",
          })}
        />
        <Tab
          label={intl.formatMessage({
            id: "label.createQuestions",
            defaultMessage: "Create New Questions",
          })}
        />
      </Tabs>
      {currentPollQuestionTab === "media" && <MediaPollQuestion />}
      {currentPollQuestionTab === "appearance" && <AppearancePollQuestion />}
      {currentPollQuestionTab === "advanced" && <AdvancedPollQuestion />}
      <DialogActions>
        <Button
          onClick={() => handleClosePollQuestion(false)}
          color="primary"
          startIcon={<Close />}
        >
          <FormattedMessage id="label.close" defaultMessage="Close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PollQuestion.propTypes = {
  currentPollQuestionTab: PropTypes.string.isRequired,
  PollQuestionOpen: PropTypes.bool.isRequired,
  handleClosePollQuestion: PropTypes.func.isRequired,
  setPollQuestionTab: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentPollQuestionTab: state.room.currentPollQuestionTab,
  PollQuestionOpen: state.room.PollQuestionOpen,
});

const mapDispatchToProps = {
  handleClosePollQuestion: roomActions.setPollQuestionOpen,
  setPollQuestionTab: roomActions.setPollQuestionTab,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual: (next, prev) => {
    return (
      prev.room.currentPollQuestionTab === next.room.currentPollQuestionTab &&
      prev.room.PollQuestionOpen === next.room.PollQuestionOpen
    );
  },
})(withStyles(styles)(PollQuestion));
