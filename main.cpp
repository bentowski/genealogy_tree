#include <cstring>
#include <cctype>
#include <algorithm>
#include <fstream>
#include <cstdlib>
#include <iostream>
#include <vector>
#include "./Human.hpp"

std::string classic_compose(std::string line)
{
  std::string ret;
	if (line.find("deathDay\": \"0000\"") != line.npos)
		return ret = "none";
  ret = line.substr(line.find_first_of(':'), line.npos);
  ret = ret.substr(ret.find_first_of('"') + 1, ret.npos);
  ret = ret.substr(0, ret.find_first_of('"'));
	if (ret.find("0000") != line.npos)
		ret = "none";
  return (ret);
}


std::string classic(std::string ret, std::string line)
{
  ret = line.substr(line.find_first_of(':'), line.npos);
  ret = ret.substr(ret.find_first_of('"') + 1, ret.npos);
  ret = ret.substr(0, ret.find_first_of('"'));
	std::for_each(ret.begin(), ret.begin(), [](char & c){ c = ::toupper(c); });
	std::for_each(ret.begin() + 1, ret.end(), [](char & c){ c = ::tolower(c); });
  return ret;
}

std::string birth(std::string ret, std::string line, std::ifstream *ifs)
{
	std::string tmp;
	ret = classic_compose(line);
	if (ret.find("none") != ret.npos)
	{
		std::getline(*ifs, line);
		std::getline(*ifs, line);
		ret = "";
		return (ret);
	}
	if (std::strlen(ret.c_str()) < 2)
		ret = "0" + ret;
	ret += "/";
	std::getline(*ifs, line);
	tmp = classic_compose(line);
	if (std::strlen(tmp.c_str()) < 2)
		tmp = "0" + tmp;
	ret += tmp;
	ret += "/";
	std::getline(*ifs, line);
	ret += classic_compose(line);
	std::for_each(ret.begin(), ret.end(), [](char & c){ c = ::tolower(c); });
	return (ret);
}

int ft_compare2(Member const & src, Member const & cmp)
{
	if (src.getName() == cmp.getName())
	{
		if (src.getLastName() == cmp.getLastName())
		{
			if (src.getNewLastName() == cmp.getNewLastName())
			{
				if (src.getBornDate() == cmp.getBornDate())
				{
					return 1;
				}
			}
		}
	}
	return 0;
}

int ft_compare(Member const & src, std::vector<Member>::iterator cmp, std::vector<Member>::iterator cmp2)
{

	if (src.getName() == cmp->getName())
	{
		if (src.getLastName() == cmp->getLastName())
		{
			if (src.getNewLastName() == cmp->getNewLastName())
			{
				if (src.getBornDate() == cmp->getBornDate())
				{
					return 1;
				}
			}
		}
	}
	if (src.getName() == cmp2->getName())
	{
		if (src.getLastName() == cmp2->getLastName())
		{
			if (src.getNewLastName() == cmp2->getNewLastName())
			{
				if (src.getBornDate() == cmp2->getBornDate())
				{
					return 1;
				}
			}
		}
	}
	return 0;
}

void printing(Member current, std::ofstream *html, std::ofstream *tag, int number, std::string tmp, int branche)
{
	size_t x = 0;
	size_t size = current.getCSize();
	std::string line;
	while (x < size)
	{
			current.getChildrens()[x].putNumber(number, tmp);
			current.getChildrens()[x].setBranche(branche);
			line = current.getChildrens()[x].getName();
			*html << "						<div ";
			*html << "style=\"display: flex; flex-direction:column; margin:5px; text-align:center\">" << std::endl;
			*html << "						<div ";
			if (number < 12 && tmp.find("/") != tmp.npos)
				*html << "id=\"" << number << "\"";
			*html << "style=\"display:flex; flex-direction:column; margin:5px; border: solid 1px black; text-align:center; justify-content:center\">" << std::endl;
			*html << "<div ";
			*html << "style=\"min-height: 270px; display:flex; flex-direction:row; margin-left:2px; margin-right:2px; text-align:center ; justify-content:center\">" << std::endl;
			*html << current.getChildrens()[x] << std::endl;
			*tag << current.getChildrens()[x].getName() << std::endl;
			*tag << current.getChildrens()[x].getNewLastName() << std::endl;
			*tag << current.getChildrens()[x].getBornDate() << std::endl;
			*tag << current.getChildrens()[x].getNumber() << std::endl;
			if (current.getChildrens()[x].checkPartner())
			{
				current.getChildrens()[x].getPartner()[0].putNumber(0, current.getChildrens()[x].getNumber());
				current.getChildrens()[x].getPartner()[0].setBranche(branche);
				*tag << current.getChildrens()[x].getPartner()[0].getName() << std::endl;
				*tag << current.getChildrens()[x].getPartner()[0].getNewLastName() << std::endl;
				*tag << current.getChildrens()[x].getPartner()[0].getBornDate() << std::endl;
				*tag << current.getChildrens()[x].getPartner()[0].getNumber() << std::endl;
				*html << current.getChildrens()[x].getPartner()[0] << std::endl;
			}
			*html << "</div>" << std::endl;
			if (current.getChildrens()[x].getCSize() != 0)
			{
				*html << "				<div style=\"display:flex; flex-direction:row; text-align:center; justify-content:center\">" << std::endl;
				printing(current.getChildrens()[x], html, tag, 1, current.getChildrens()[x].getNumber(), branche);
				*html << "				</div>" << std::endl;
			}
			*html << "						</div>" << std::endl;
			*html << "				</div>" << std::endl;
			number++;
			x++;
	}
}

void printing2(Member current, std::ofstream *html, std::ofstream *tag)
{
	int number = 0;
	*html << "				<div style=\"font-size: 1em; display:flex; flex-direction:column; margin:5px; border: solid 1px black; text-align:center\">" << std::endl;
	*html << "<div style=\"display:flex; flex-direction:row; margin-left:2px; margin-right:2px; text-align:center ; justify-content:center\">" << std::endl;
	*html << current << std::endl;
	if (current.checkPartner())
		*html << current.getPartner()[0] << std::endl;
	*html << "</div>" << std::endl;
	*html << "						<div style=\"display:flex; flex-direction:row; margin:5px; text-align:center; justify-content:center\">" << std::endl;
	printing(current, html, tag, number + 1, "/", 1);
	*html << "						</div>" << std::endl;
	*html << "				</div>" << std::endl;
}

int test(Member *current, Member *src)
{
	size_t size = current->getCSize();
	size_t x = 0;
	int ret = 0;

	if (src->getPSize() && ft_compare(*current, src->getParents(), src->getLastParents()))
	{
		while (x < size)
		{
			if (ft_compare2(*src, current->getChildrens()[x]))
			{
				// if (src->getCSize() < current->getChildrens()[x].getCSize())
				// {
					break;
				// }
					// if (src->getPaSize() <= current->getChildrens()[x].getPaSize())
				current->eraseChildrens(current->getChildrens() + x);
			}
			x++;
		}
		if (x == size)
		{
			current->setChildrens(*src);
		}
		// else
		// {
		// 		current->getChildrens()[x].setPartner(src->getPartner()[0]);
		// }
		return 1;
	}
	x = 0;
	while (x < size)
	{
			ret = test(&current->getChildrens()[x], src);
			x++;
	}
	return ret;
}

void ajust(Member *first, std::ofstream *html, std::ofstream *tag)
{
	size_t x = 0;
	size_t size = first->getCSize();
	int p = 0;
	Member *tmp = NULL;

	p = 1;
	int z = 0;
	std::cout << size << std::endl;
	while (size != 1 && z < 13)
	{
		x = 0;
		p = 0;
		while (x < size)
		{
			tmp = &first->getChildrens()[x];
			p = test(first, tmp);
			if (p)
			{
				first->eraseChildrens(first->getChildrens() + x);
				size--;
				break;
			}
			x++;
		}
		size = first->getCSize();
		z++;
	}
	std::cout << size << std::endl;
	printing2(first->getChildrens()[0], html, tag);
}

int main(int argc, char ** argv)
{
	std::string line;
	std::string relation;
	std::string name = "";
	std::string lastName = "";
	std::string newLastName = "";
	std::string deathDate = "";
	std::string bornDate = "";
	Member first("none","none","none", "", "");
	Member tmp("none","none","none", "", "");
	std::ofstream html("etiquette.html");
	std::ofstream tag("tag.txt");

	if (argc == 2)
	{
		std::ifstream ifs(argv[1]);
		if (ifs.good())
		{
			while (std::getline(ifs, line) && line.find("user") == line.npos);
			while (std::getline(ifs, line) && line.find("];") == line.npos)
			{
					if (line.find("firstName") != line.npos)
					{
						name = classic(name, line);
						deathDate = "";
					}
					else if (line.find("newlastName") != line.npos)
						newLastName = classic(newLastName, line);
					else if (line.find("lastName") != line.npos && line.find("newlastName") == line.npos)
						lastName = classic(lastName, line);
					else if (line.find("birth") != line.npos)
						bornDate = birth(bornDate, line, &ifs);
					else if (line.find("death") != line.npos)
						deathDate = birth(deathDate, line, &ifs);
					else if (line.find("relatives") != line.npos)
					{
						Member newby(name, lastName, newLastName, bornDate, deathDate);
						while (std::getline(ifs, line) && line.find("]") == line.npos)
						{
							if (line.find("relationship") != line.npos)
							{
								relation = line;
								deathDate = "";
							}
							else if (line.find("firstName") != line.npos)
								name = classic(name, line);
							else if (line.find("newlastName") != line.npos)
								newLastName = classic(newLastName, line);
							else if (line.find("lastName") != line.npos && line.find("newlastName") == line.npos)
								lastName = classic(lastName, line);
							else if (line.find("birth") != line.npos)
								bornDate = birth(bornDate, line, &ifs);
							else if (line.find("death") != line.npos)
								deathDate = birth(deathDate, line, &ifs);
							else if (line.find("talent") != line.npos)
							{

								Member adding(name, lastName, newLastName, bornDate, deathDate);
								if (relation.find("children") != relation.npos)
								{
									// first.setChildrens(adding);
									adding.setParents(newby);
									newby.setChildrens(adding);
								}
								else if (relation.find("parent") != relation.npos && relation.find("grand-parent") == relation.npos)
								{
									newby.setParents(adding);
									adding.setChildrens(newby);
								}
								else if (relation.find("partner") != relation.npos)
								{
									newby.setPartner(adding);
									adding.setPartner(newby);
								}
							}
						}
						first.setChildrens(newby);
					}
			}
			//============ change parents ===============

			html << "<!DOCTYPE html>" << std::endl;
			html << "  <html lang=\"fr\">" << std::endl;
			html << "    <head>" << std::endl;
			html << "      <meta charset=\"UTF-8\" />" << std::endl;
			html << "      <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />" << std::endl;
			html << "      <link rel=\"stylesheet\" href=\"./styles.css\" type=\"text/css\" />" << std::endl;
			html << "      <script src=\"../js/index.js\" defer></script>" << std::endl;
			html << "      <style>" << std::endl;
			html << "      		#\\31" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(212, 72, 202, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(212, 72, 202, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(212, 72, 202, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(212, 72, 202, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\32" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(254, 33, 10, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(254, 33, 10, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(254, 33, 10, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(254, 33, 10, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\33" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(76, 212, 22, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(76, 212, 22, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(76, 212, 22, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(76, 212, 22, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\34" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(251, 247, 71, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(251, 247, 71, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(251, 247, 71, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(251, 247, 71, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\35" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(128, 128, 128, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(128, 128, 128, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(128, 128, 128, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(128, 128, 128, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\36" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(76, 203, 220, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(76, 203, 220, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(76, 203, 220, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(76, 203, 220, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\37" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(255, 179, 255, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(255, 179, 255, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(255, 179, 255, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(255, 179, 255, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\38" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(171, 255, 171, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(171, 255, 171, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(171, 255, 171, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(171, 255, 171, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\39" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(255, 121, 121, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(255, 121, 121, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(255, 121, 121, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(255, 121, 121, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\31\\30" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(110, 81, 183, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(110, 81, 183, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(110, 81, 183, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(110, 81, 183, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      		#\\31\\31" << std::endl;
			html << "      		{" << std::endl;
			html << "      			border: none !important;" << std::endl;
			html << "      			border-top: 40px solid rgba(243, 128, 33, 1) !important;" << std::endl;
			html << "      			border-left: 4px solid rgba(243, 128, 33, 1) !important;" << std::endl;
			html << "      			border-right: 4px solid rgba(243, 128, 33, 1) !important;" << std::endl;
			html << "      			border-bottom: 4px solid rgba(243, 128, 33, 1) !important;" << std::endl;
			html << "      		}" << std::endl;
			html << "      </style>" << std::endl;
			html << "      <meta name=\"description\" content=\"Par ici la cousinade des Baudry\" />" << std::endl;
			html << "      <title>Cousinade Baudry</title>" << std::endl;
			html << "    </head>" << std::endl;
			html << "    <body>" << std::endl;
			html << "			<div class=\"contening\" style=\"display:flex; flex-direction:row\">" << std::endl;
			ajust(&first, &html, &tag);
			html << "			</div>" << std::endl;
			html << "			</body>" << std::endl;
			html << "		</html>" << std::endl;
		}
		else
			std::cout << "Opening File Error" << std::endl;
	}
	else
		std::cout << "error: no or too much file(s)" << std::endl;
}
