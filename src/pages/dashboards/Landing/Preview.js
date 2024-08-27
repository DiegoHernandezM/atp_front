import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid, Toolbar,
  Tooltip,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import ThemedLogo from "../../../components/ThemeLogo";
import backgroundJpe from "../../../vendor/jep2.jpg";
import {Link} from "react-router-dom";
import {Book, List, PlusCircle as PlusCircleIcon, Search} from "react-feather";
import {rgba} from "polished";
import PropTypes from "prop-types";
const Typography = styled(MuiTypography)(spacing);

Preview.propTypes = {
  content: PropTypes.object
};

const Wrapper = styled.div`
  padding-top: 3.5rem;
  position: relative;
  text-align: center;
  overflow: hidden;

  @keyframes perspectiveAnimation {
    from {
      opacity: 0.1;
      transform: perspective(1500px) rotateX(0deg);
    }

    to {
      opacity: 1;
      transform: perspective(2000px) rotateX(25deg);
    }
  }

  .animate__perspective {
    animation-name: perspectiveAnimation;
  }
`;

const Content = styled.div`
  padding: ${(props) => props.theme.spacing(6)} 0;
  line-height: 150%;
`;

const ImageBack = styled.img`
  max-width: 100%;
  height: auto;
  min-height: 33vh;
  display: block;
  box-shadow: 0 6px 18px 0 rgba(18, 38, 63, 0.075);
  border-radius: 5px;
  z-index: 0;
  opacity: 0.1;
  image-rendering: optimizequality;
  image-rendering: -webkit-optimize-contrast;
  margin-bottom: -100px;
  margin-top: -35px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: auto;
`;

const ImageWrapper = styled.div`
  background-attachment: fixed;
  &:before {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.02));
    bottom: 0;
    left: 0;
    position: absolute;
    content: " ";
    z-index: 1;
    display: block;
    width: 50%;
    height: 75px;
    pointer-events: none;
  }
`;

const Title = styled(Typography)`
  opacity: 0.9;
  line-height: 1.4;
  font-size: 1.75rem;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};

  ${(props) => props.theme.breakpoints.up("sm")} {
    font-size: 2rem;
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    font-size: 2.5rem;
  }

  span {
    color: ${(props) => props.theme.palette.secondary.main};
  }
`;

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  margin: ${(props) => props.theme.spacing(2)} 0;
`;

const BrandIcon = styled.img`
  vertical-align: middle;
  margin-right: ${(props) => props.theme.spacing(3)};
  height: auto;
`;

const ArrowForward = styled(ArrowForwardIcon)`
  margin-left: ${(props) => props.theme.spacing(2)};
`;

const ContainerFrame = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-top: 56.25%; 
`;

const VideoFrame = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

export default function Preview({content}) {
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setTriggerAnimation(true);
    }, 500);
  }, []);

  const Brand = styled.div`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

  const Feature = ({ Icon, title, description }) => {
    return (
      <Grid item xs={12} sm={6} md={3} lg={3}>
        <FeatureWrapper>
          <FeatureIcon>
            <Icon color="white" />
          </FeatureIcon>
          <Box ml={6}>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {description}
            </Typography>
          </Box>
        </FeatureWrapper>
      </Grid>
    );
  };

  const FeatureWrapper = styled.div`
  display: flex;
  text-align: left;
  padding: 18px 20px;
`;

  const FeatureIcon = styled.div`
  svg {
    flex-shrink: 0;
    width: auto;
    height: 48px;
    width: 48px;
    background: ${(props) => rgba(props.theme.palette.primary.main, 0.15)};
    color: ${(props) => props.theme.palette.primary.main};
    padding: 10px;
    border-radius: 50%;
  }
`;

  return (
    <>
      <AppBar position="relative" color="transparent" elevation={4} style={{ backgroundColor:"#203764", color:"white" }}>
        <Toolbar>
          <Container>
            <Grid container alignItems="center">
              <Grid item>
                <Brand>
                  {content.title}
                </Brand>
              </Grid>
              <Grid item xs />
              <Grid item>
                <Box sx={{ display: { xs: "inline-block", md: "inline-block" } }}>
                  <Button
                    ml={2}
                    color="inherit"
                    component={Link}
                    to="/auth/sign-in"
                  >
                    {content.login_link_text}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
      <Wrapper>
        <Container>
          <ImageWrapper style={{ alignItems: "center" }}>
            <ImageBack alt="App de aviacion" src={backgroundJpe} />
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={4}
            >
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <ContainerFrame>
                  <VideoFrame>
                    <iframe
                      width="100%"
                      height="100%"
                      src={content.link_video}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </VideoFrame>
                </ContainerFrame>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Content>
                  <Box align="center">
                    <ThemedLogo alt="logo" align="center"/>
                  </Box>
                  <Title variant="h1" gutterBottom>
                    {content.subtitle}{" "}
                  </Title>
                  <Grid container justifyContent="center" spacing={4}>
                    <Grid item xs={12} lg={10}>
                      <Subtitle color="textSecondary">
                        {content.principal_text}
                      </Subtitle>
                    </Grid>
                  </Grid>
                  <Box my={6}>
                    <Button
                      href="/auth/sign-up"
                      variant="contained"
                      color="secondary"
                      size="large"
                    >
                      {content.subscribe_button}
                      <ArrowForward />
                    </Button>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {content.compatible_text}
                  </Typography>
                  <div
                    className={`animate__animated ${
                      triggerAnimation ? "animate__fadeIn" : ""
                    }`}
                    style={{ opacity: triggerAnimation ? 1 : 0 }}
                  >
                    <Box my={3}>
                      <Tooltip title="Chrome">
                        <BrandIcon
                          alt="Chrome"
                          src="/static/img/brands/chrome.png"
                          style={{ width: "40px" }}
                        />
                      </Tooltip>
                      <Tooltip title="Android">
                        <BrandIcon
                          alt="Android"
                          src="/static/img/brands/android.png"
                          style={{ width: "40px", background: "#FFF" }}
                        />
                      </Tooltip>
                      <Tooltip title="Apple">
                        <BrandIcon
                          alt="Apple"
                          src="/static/img/brands/appleinc.png"
                          style={{ width: "22px" }}
                        />
                      </Tooltip>
                    </Box>
                  </div>
                </Content>
              </Grid>
            </Grid>
          </ImageWrapper>
        </Container>
      </Wrapper>
      <Wrapper style={{ backgroundColor:"#203764", color:"white" }}>
        <Container>
          <Typography variant="h2" component="h3" gutterBottom>
            {content.footer_title}
          </Typography>
          <Box mb={12} />
          <Grid container spacing={4}>
            <Feature
              Icon={Book}
              title={content.footer_text_1}
              description=""
            />
            <Feature
              Icon={PlusCircleIcon}
              title={content.footer_text_2}
              description=""
            />
            <Feature
              Icon={Search}
              title={content.footer_text_3}
              description=""
            />
            <Feature
              Icon={List}
              title={content.footer_text_4}
              description=""
            />
          </Grid>
        </Container>
      </Wrapper>
    </>
  );
}
